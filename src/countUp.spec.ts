import { CountUp } from './countUp';

describe('CountUp', () => {

  let countUp;
  beforeEach(() => {
    document.body.innerHTML =
      '<div>' +
      '  <h1 id="target" />' +
      '</div>';
  });

  it('should create for a valid target', () => {
    countUp = new CountUp('target', 100);

    expect(countUp).toBeTruthy();
    expect(countUp.error.length).toBe(0);
  });

  it('should set an error for a bad target', () => {
    countUp = new CountUp('notThere', 100);

    expect(countUp.error.length).toBeGreaterThan(0);
  });
});
