import { Position } from './position';

describe('Position', () => {
  const validPositionData = {
    symbol: 'AAPL',
    shares: 10,
    entryPrice: 150,
    entryDate: '2023-01-01',
  };
  let position: Position;

  beforeEach(() => {
    position = new Position(validPositionData);
  });

  describe('constructor', () => {
    it('should create a position without throwing an error for valid data', () => {
      expect(() => new Position(validPositionData)).not.toThrow();
    });
  });

  describe('Stop and Profit Targets', () => {
    it('should initially have no stop-loss or take-profit price', () => {
      expect(position.getStopLossPrice()).toBeUndefined();
      expect(position.getTakeProfitPrice()).toBeUndefined();
    });

    it('should set and get the stop-loss price', () => {
      position.setStopLossPrice(140);
      expect(position.getStopLossPrice()).toBe(140);
    });

    it('should throw an error when setting a negative stop-loss price', () => {
      expect(() => position.setStopLossPrice(-1)).toThrow(
        'Stop loss price cannot be negative.',
      );
    });

    it('should set and get the take-profit price', () => {
      position.setTakeProfitPrice(160);
      expect(position.getTakeProfitPrice()).toBe(160);
    });

    it('should throw an error when setting a negative take-profit price', () => {
      expect(() => position.setTakeProfitPrice(-1)).toThrow(
        'Take profit price cannot be negative.',
      );
    });
  });

  describe('Value and P/L Calculations', () => {
    it('should calculate the correct entry value', () => {
      expect(position.getEntryValue()).toBe(1500); // 10 * 150
    });

    it('should calculate the correct current value for a given price', () => {
      expect(position.getCurrentValue(160)).toBe(1600); // 10 * 160
    });

    it('should throw an error for a negative current price', () => {
      expect(() => position.getCurrentValue(-1)).toThrow(
        'Current price cannot be negative.',
      );
    });

    it('should calculate the correct profit or loss', () => {
      // Profit
      expect(position.getProfitOrLoss(160)).toBe(100); // 1600 - 1500

      // Loss
      expect(position.getProfitOrLoss(145)).toBe(-50); // 1450 - 1500

      // Break-even
      expect(position.getProfitOrLoss(150)).toBe(0); // 1500 - 1500
    });
  });
});
