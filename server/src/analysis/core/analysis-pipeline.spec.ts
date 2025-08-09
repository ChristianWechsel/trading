import { OHLCV } from '../../data-aggregation/ohlcv.entity';
import { AnalysisQueryDto } from '../analysis-query.dto';
import { AnalysisContextClass } from './analysis-context';
import { AnalysisPipeline } from './analysis-pipeline';
import { AnalysisStep, Step } from './analysis.interface';

class MockStep implements AnalysisStep {
  name: Step;
  dependsOn: Step[] = [];

  constructor(name: Step, dependsOn: Step[] = []) {
    this.name = name;
    this.dependsOn = dependsOn;
  }

  execute(_context: AnalysisContextClass): void {
    // This implementation will be replaced by a spy in the test
  }
}

class MutatorStep implements AnalysisStep {
  name: Step = 'SwingPointDetection'; // Example name
  dependsOn: Step[] = [];

  execute(context: AnalysisContextClass): void {
    if (context.getEnrichedDataPoints().length > 0) {
      context.getEnrichedDataPoints()[0].setSwingPointType('swingLow');
    }
  }
}

describe('AnalysisPipeline', () => {
  let context: AnalysisContextClass;
  let query: AnalysisQueryDto;
  const ohlcvs: OHLCV[] = [
    new OHLCV({
      securityId: 1,
      priceDate: '2023-01-01',
      openPrice: 100,
      highPrice: 110,
      lowPrice: 90,
      closePrice: 105,
      adjustedClosePrice: 105,
      volume: 1000,
    }),
    new OHLCV({
      securityId: 1,
      priceDate: '2023-01-02',
      openPrice: 105,
      highPrice: 115,
      lowPrice: 100,
      closePrice: 110,
      adjustedClosePrice: 110,
      volume: 1200,
    }),
  ];

  beforeEach(() => {
    query = {
      dataAggregation: { ticker: { symbol: 'TEST', exchange: 'XETRA' } },
      steps: [],
    } as AnalysisQueryDto;
    context = new AnalysisContextClass(query, ohlcvs);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('run method', () => {
    it('should call the execute method of each step with the correct AnalysisContext', () => {
      const step1 = new MockStep('SwingPointDetection');
      const step2 = new MockStep('TrendDetection', ['SwingPointDetection']);
      const executeSpy1 = jest.spyOn(step1, 'execute');
      const executeSpy2 = jest.spyOn(step2, 'execute');

      const pipeline = new AnalysisPipeline([step1, step2]);
      const result = pipeline.run(context);

      expect(executeSpy1).toHaveBeenCalledTimes(1);
      expect(executeSpy1).toHaveBeenCalledWith(context);

      expect(executeSpy2).toHaveBeenCalledTimes(1);
      expect(executeSpy2).toHaveBeenCalledWith(context);

      expect(result).toBe(context);
    });

    it('should modify the context that was passed in', () => {
      const mutatorStep = new MutatorStep();
      const pipeline = new AnalysisPipeline([mutatorStep]);

      const result = pipeline.run(context);

      expect(result.getEnrichedDataPoints()[0].getSwingPointType()).toBe(
        'swingLow',
      );
      expect(context.getEnrichedDataPoints()[0].getSwingPointType()).toBe(
        'swingLow',
      );
    });

    it('should execute the steps in the correct order', () => {
      const callOrder: string[] = [];
      const step1 = new MockStep('SwingPointDetection');
      const step2 = new MockStep('TrendDetection', ['SwingPointDetection']);

      jest
        .spyOn(step1, 'execute')
        .mockImplementation(() => callOrder.push('step1'));
      jest
        .spyOn(step2, 'execute')
        .mockImplementation(() => callOrder.push('step2'));

      const pipeline = new AnalysisPipeline([step1, step2]);
      const emptyContext = new AnalysisContextClass(query, []);
      pipeline.run(emptyContext);

      expect(callOrder).toEqual(['step1', 'step2']);
    });
  });

  describe('constructor and validation', () => {
    it('should NOT throw an error if dependencies and order are correct', () => {
      const step1 = new MockStep('SwingPointDetection');
      const step2 = new MockStep('TrendDetection', ['SwingPointDetection']);

      expect(() => new AnalysisPipeline([step1, step2])).not.toThrow();
    });

    it('should throw an error if a dependency is missing', () => {
      const step2 = new MockStep('TrendDetection', ['SwingPointDetection']);

      expect(() => new AnalysisPipeline([step2])).toThrow(
        "Missing dependency: 'TrendDetection' requires 'SwingPointDetection', which is not configured in the pipeline.",
      );
    });

    it('should throw an error if the dependency order is wrong', () => {
      const step1 = new MockStep('SwingPointDetection');
      const step2 = new MockStep('TrendDetection', ['SwingPointDetection']);

      expect(() => new AnalysisPipeline([step2, step1])).toThrow(
        "Invalid order: 'SwingPointDetection' must run before 'TrendDetection'.",
      );
    });
  });
});
