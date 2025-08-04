import { Position } from './position';

describe('Position', () => {
  const validPositionData = {
    symbol: 'AAPL',
    shares: 10,
    entryPrice: 150,
    entryDate: new Date('2023-01-01T00:00:00.000Z'),
  };
  let position: Position;

  beforeEach(() => {
    position = new Position(validPositionData);
  });

  describe('constructor', () => {
    it('should create a position without throwing an error for valid data', () => {
      expect(() => new Position(validPositionData)).not.toThrow();
    });

    it('should return the correct identifier', () => {
      const expectedIdentifier = `${
        validPositionData.symbol
      } ${validPositionData.entryDate.toISOString()}`;
      expect(position.getIdentifier()).toBe(expectedIdentifier);
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

    it('should calculate the correct exit value after closing', () => {
      position.closePosition(160);
      expect(position.getExitValue()).toBe(1600); // 10 * 160
    });

    it('should throw an error when trying to get exit value before closing', () => {
      expect(() => position.getExitValue()).toThrow(
        'Position is not closed yet.',
      );
    });

    describe('getProfitOrLoss', () => {
      it('should throw an error if the position is not closed', () => {
        expect(() => position.getProfitOrLoss()).toThrow(
          'Position is not closed yet.',
        );
      });

      it('should calculate the correct profit after closing', () => {
        position.closePosition(160); // Close with profit
        expect(position.getProfitOrLoss()).toBe(100); // 10 * 160 - 1500
      });

      it('should calculate the correct loss after closing', () => {
        position.closePosition(145); // Close with loss
        expect(position.getProfitOrLoss()).toBe(-50); // 10 * 145 - 1500
      });

      it('should calculate zero profit/loss at break-even after closing', () => {
        position.closePosition(150); // Close at break-even
        expect(position.getProfitOrLoss()).toBe(0); // 10 * 150 - 1500
      });
    });
  });
});
