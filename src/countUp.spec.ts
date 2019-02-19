import { CountUp } from './countUp';

describe('CountUp', () => {

  let countUp;
  let time;

  beforeEach(() => {
    document.body.innerHTML =
      '<div>' +
      '  <h1 id="target"></h1>' +
      '</div>';

    time = 0;
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      time += 100;
      if (time < 2000) {
        return cb(time) as any;
      }
    });
  });

  it('should create for a valid target, and print startVal', () => {
    countUp = new CountUp('target', 100);

    expect(countUp).toBeTruthy();
    expect(countUp.error.length).toBe(0);
    expect(document.getElementById('target').innerHTML).toEqual('0');
  });

  it('should set an error for a bad target', () => {
    countUp = new CountUp('notThere', 100);

    expect(countUp.error.length).toBeGreaterThan(0);
  });

  it('should count when start method is called', () => {
    countUp = new CountUp('target', 100);
    countUp.start();

    expect(document.getElementById('target').innerHTML).toEqual('100');
  });
});
