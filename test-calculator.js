// Simple test to verify calculator logic
// This simulates the key functions from useCalculator hook

const computeExpression = (expr, angleMode = 'DEG') => {
  try {
    // Parse trig, log, and other scientific functions
    let e = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/\^/g, '**')
      .replace(/π/g, Math.PI.toString())
      .replace(/E/g, 'e');
    
    // Auto-insert multiplication for implicit cases (2(3) → 2*(3))
    e = e.replace(/(\d)(\()/g, '$1*$2');
    e = e.replace(/(\))(\d)/g, '$1*$2');
    e = e.replace(/(\))(\()/g, '$1*$2');
    
    // Handle regular trig functions with proper degree conversion
    e = e.replace(/sin\(([^)]+)\)/g, (_, x) => {
      const val = parseFloat(x);
      const radians = angleMode === 'DEG' ? (val * Math.PI) / 180 : val;
      return Math.sin(radians).toString();
    });
    e = e.replace(/cos\(([^)]+)\)/g, (_, x) => {
      const val = parseFloat(x);
      const radians = angleMode === 'DEG' ? (val * Math.PI) / 180 : val;
      return Math.cos(radians).toString();
    });
    e = e.replace(/tan\(([^)]+)\)/g, (_, x) => {
      const val = parseFloat(x);
      const radians = angleMode === 'DEG' ? (val * Math.PI) / 180 : val;
      return Math.tan(radians).toString();
    });
    
    // Handle logarithmic functions
    e = e.replace(/log\(([^)]+)\)/g, (_, x) => Math.log10(parseFloat(x)).toString());
    e = e.replace(/ln\(([^)]+)\)/g, (_, x) => Math.log(parseFloat(x)).toString());
    
    // Handle root functions
    e = e.replace(/√\(([^)]+)\)/g, (_, x) => Math.sqrt(parseFloat(x)).toString());
    
    // Handle power functions like x², x³
    e = e.replace(/\*\*(\s*2\s*)/g, '**2');
    e = e.replace(/\*\*(\s*3\s*)/g, '**3');
    
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + e + ')')();
    
    // Handle NaN results from invalid operations
    if (isNaN(result)) return 'Math ERROR';
    if (!isFinite(result)) return 'Math ERROR';
    
    // Round floating point noise
    const rounded = Math.round(result * 1e10) / 1e10;
    return rounded;
  } catch {
    return 'Syntax ERROR';
  }
};

// Test cases
const tests = [
  { expr: '2+3', expected: 5, description: 'Basic addition' },
  { expr: '10-4', expected: 6, description: 'Basic subtraction' },
  { expr: '6*7', expected: 42, description: 'Basic multiplication' },
  { expr: '15/3', expected: 5, description: 'Basic division' },
  { expr: '2**3', expected: 8, description: 'Power operation' },
  { expr: '√(16)', expected: 4, description: 'Square root' },
  { expr: 'log(100)', expected: 2, description: 'Log base 10' },
  { expr: 'sin(30)', expected: 0.5, description: 'Sine in degrees' },
  { expr: 'cos(60)', expected: 0.5, description: 'Cosine in degrees' },
  { expr: 'tan(45)', expected: 1, description: 'Tangent in degrees' },
  { expr: '2*(3+4)', expected: 14, description: 'Complex expression' },
  { expr: 'sin(30)+cos(60)', expected: 1, description: 'Trig combination' },
];

console.log('Testing Calculator Logic:\n');

tests.forEach((test, index) => {
  const result = computeExpression(test.expr);
  const passed = Math.abs(result - test.expected) < 0.0001;
  console.log(`${index + 1}. ${test.description}: ${test.expr}`);
  console.log(`   Expected: ${test.expected}, Got: ${result} ${passed ? '✓' : '✗'}`);
  console.log('');
});

console.log('\nTest completed!');
