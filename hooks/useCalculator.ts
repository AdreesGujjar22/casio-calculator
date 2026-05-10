import { useCallback, useState } from 'react';

export interface CalculatorState {
  display: string;
  expression: string;
  memory: number;
  shift: boolean;
  alpha: boolean;
  angleMode: 'DEG' | 'RAD' | 'GRA';
  lastResult: number | null;
  justEvaluated: boolean;
  isError: boolean;
  history: string[];
  historyIndex: number;
}

export const useCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState(0);
  const [shift, setShift] = useState(false);
  const [alpha, setAlpha] = useState(false);
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD' | 'GRA'>('DEG');
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [isError, setIsError] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const toRad = useCallback((angle: number) => {
    if (angleMode === 'DEG') return (angle * Math.PI) / 180;
    if (angleMode === 'GRA') return (angle * Math.PI) / 200;
    return angle;
  }, [angleMode]);

  const computeExpression = useCallback((expr: string) => {
    try {
      // Parse trig, log, and other scientific functions
      let e = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/\^/g, '**') // Fix: Change ^ to ** for JavaScript power operator
        .replace(/π/g, Math.PI.toString())
        .replace(/E/g, 'e')
        .replace(/=/g, ''); // Remove = from expression before evaluation
      
      // Auto-insert multiplication for implicit cases (2(3) → 2*(3))
      e = e.replace(/(\d)(\()/g, '$1*$2');
      e = e.replace(/(\))(\d)/g, '$1*$2');
      e = e.replace(/(\))(\()/g, '$1*$2');
      
      // Handle factorial
      e = e.replace(/(\d+(?:\.\d+)?)!(?![^(]*\))/g, (_, num) => {
        const n = parseFloat(num);
        if (n < 0 || n !== Math.floor(n)) return 'NaN';
        if (n > 170) return 'Infinity'; // Prevent overflow
        let result = 1;
        for (let i = 2; i <= n; i++) {
          result *= i;
        }
        return result.toString();
      });
      
      // Handle combinations (nCr)
      e = e.replace(/nCr\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)/g, (_, n, r) => {
        const nVal = parseFloat(n);
        const rVal = parseFloat(r);
        if (rVal > nVal || rVal < 0) return 'NaN';
        
        // Calculate nCr = n! / (r! * (n-r)!)
        let numerator = 1;
        for (let i = 0; i < rVal; i++) {
          numerator *= (nVal - i);
        }
        let denominator = 1;
        for (let i = 1; i <= rVal; i++) {
          denominator *= i;
        }
        return (numerator / denominator).toString();
      });
      
      // Handle permutations (nPr)
      e = e.replace(/nPr\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)/g, (_, n, r) => {
        const nVal = parseFloat(n);
        const rVal = parseFloat(r);
        if (rVal > nVal || rVal < 0) return 'NaN';
        
        let result = 1;
        for (let i = 0; i < rVal; i++) {
          result *= (nVal - i);
        }
        return result.toString();
      });
      
      // Handle regular trig functions with proper degree conversion
      e = e.replace(/sin\(([^)]+)\)/g, (_, x) => {
        const val = parseFloat(x);
        let radians = val;
        if (angleMode === 'DEG') radians = (val * Math.PI) / 180;
        else if (angleMode === 'GRA') radians = (val * Math.PI) / 200;
        return Math.sin(radians).toString();
      });
      e = e.replace(/cos\(([^)]+)\)/g, (_, x) => {
        const val = parseFloat(x);
        let radians = val;
        if (angleMode === 'DEG') radians = (val * Math.PI) / 180;
        else if (angleMode === 'GRA') radians = (val * Math.PI) / 200;
        return Math.cos(radians).toString();
      });
      e = e.replace(/tan\(([^)]+)\)/g, (_, x) => {
        const val = parseFloat(x);
        let radians = val;
        if (angleMode === 'DEG') radians = (val * Math.PI) / 180;
        else if (angleMode === 'GRA') radians = (val * Math.PI) / 200;
        return Math.tan(radians).toString();
      });
      
      // Handle hyperbolic trig functions
      e = e.replace(/hyp\(\s*sin\(([^)]+)\)\s*\)/g, (_, x) => Math.sinh(parseFloat(x)).toString());
      e = e.replace(/hyp\(\s*cos\(([^)]+)\)\s*\)/g, (_, x) => Math.cosh(parseFloat(x)).toString());
      e = e.replace(/hyp\(\s*tan\(([^)]+)\)\s*\)/g, (_, x) => Math.tanh(parseFloat(x)).toString());
      
      // Handle inverse trig functions with proper degree conversion
      e = e.replace(/sin⁻¹\(([^)]+)\)/g, (_, x) => {
        const val = parseFloat(x);
        const result = Math.asin(val);
        if (angleMode === 'DEG') return ((result * 180) / Math.PI).toString();
        if (angleMode === 'GRA') return ((result * 200) / Math.PI).toString();
        return result.toString();
      });
      e = e.replace(/cos⁻¹\(([^)]+)\)/g, (_, x) => {
        const val = parseFloat(x);
        const result = Math.acos(val);
        if (angleMode === 'DEG') return ((result * 180) / Math.PI).toString();
        if (angleMode === 'GRA') return ((result * 200) / Math.PI).toString();
        return result.toString();
      });
      e = e.replace(/tan⁻¹\(([^)]+)\)/g, (_, x) => {
        const val = parseFloat(x);
        const result = Math.atan(val);
        if (angleMode === 'DEG') return ((result * 180) / Math.PI).toString();
        if (angleMode === 'GRA') return ((result * 200) / Math.PI).toString();
        return result.toString();
      });
      
      // Handle logarithmic functions
      e = e.replace(/log\(([^)]+)\)/g, (_, x) => Math.log10(parseFloat(x)).toString());
      e = e.replace(/ln\(([^)]+)\)/g, (_, x) => Math.log(parseFloat(x)).toString());
      
      // Handle exponential functions
      e = e.replace(/10ˣ\(([^)]+)\)/g, (_, x) => Math.pow(10, parseFloat(x)).toString());
      e = e.replace(/eˣ\(([^)]+)\)/g, (_, x) => Math.exp(parseFloat(x)).toString());
      
      // Handle root functions
      e = e.replace(/√\(([^)]+)\)/g, (_, x) => Math.sqrt(parseFloat(x)).toString());
      e = e.replace(/³√\(([^)]+)\)/g, (_, x) => Math.cbrt(parseFloat(x)).toString());
      
      // Handle power functions like x², x³
      e = e.replace(/\^(\s*2\s*)/g, '**2');
      e = e.replace(/\^(\s*3\s*)/g, '**3');
      e = e.replace(/\^(\s*-1\s*)/g, '**-1');
      
      // Handle xʸ√ function (y-th root of x)
      e = e.replace(/xʸ√\(([^,]+),\s*([^)]+)\)/g, (_, x, y) => {
        const xVal = parseFloat(x);
        const yVal = parseFloat(y);
        if (yVal === 0) return 'ERROR';
        return Math.pow(xVal, 1/yVal).toString();
      });
      
      // Handle fraction conversion (a b/c)
      e = e.replace(/(\d+(?:\.\d+)?)\s*a\s*b\s*c/g, (_, num) => {
        const value = parseFloat(num);
        if (value === 0) return "0";
        
        // Find simplest fraction representation
        let numerator = Math.round(value * 1000000); // Work with high precision
        let denominator = 1000000;
        
        // Reduce fraction
        const gcd = (a: number, b: number) => {
          while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
          }
          return a;
        };
        
        const divisor = gcd(Math.abs(numerator), denominator);
        numerator /= divisor;
        denominator /= divisor;
        
        // Extract whole number part
        const whole = Math.floor(numerator / denominator);
        const remainder = Math.abs(numerator % denominator);
        
        if (whole === 0) {
          return `${remainder}▸${denominator}`;
        } else if (remainder === 0) {
          return whole.toString();
        } else {
          return `${whole}▸${remainder}▸${denominator}`;
        }
      });
      
      // Handle Pol function (rectangular to polar)
      e = e.replace(/Pol\(([^,]+),\s*([^)]+)\)/g, (_, x, y) => {
        const xVal = parseFloat(x);
        const yVal = parseFloat(y);
        const r = Math.sqrt(xVal * xVal + yVal * yVal);
        let theta = Math.atan2(yVal, xVal);
        
        // Convert to current angle mode
        if (angleMode === 'DEG') theta = theta * 180 / Math.PI;
        else if (angleMode === 'GRA') theta = theta * 200 / Math.PI;
        
        return `r=${r.toFixed(6)}, θ=${theta.toFixed(6)}`;
      });
      
      // Handle Rec function (polar to rectangular)
      e = e.replace(/Rec\(([^,]+),\s*([^)]+)\)/g, (_, r, theta) => {
        const rVal = parseFloat(r);
        let thetaVal = parseFloat(theta);
        
        // Convert from current angle mode to radians
        if (angleMode === 'DEG') thetaVal = thetaVal * Math.PI / 180;
        else if (angleMode === 'GRA') thetaVal = thetaVal * Math.PI / 200;
        
        const x = rVal * Math.cos(thetaVal);
        const y = rVal * Math.sin(thetaVal);
        
        return `x=${x.toFixed(6)}, y=${y.toFixed(6)}`;
      });
      
      // Handle degree/minute/second conversions
      e = e.replace(/(\d+)\s*°\s*(\d+)\s*'\s*(\d+)\s*"/g, (_, d, m, s) => {
        const degrees = parseFloat(d);
        const minutes = parseFloat(m);
        const seconds = parseFloat(s);
        const decimalDegrees = degrees + minutes/60 + seconds/3600;
        return decimalDegrees.toString();
      });
      
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
  }, [toRad, angleMode])

  const formatDisplay = (val: number | string) => {
    if (typeof val === 'string') return val;
    if (val === null || val === undefined) return '0';
    const s = val.toString();
    if (s.length <= 10) return s;
    // Scientific notation
    return val.toExponential(6);
  };

  return {
    display,
    setDisplay,
    expression,
    setExpression,
    memory,
    setMemory,
    shift,
    setShift,
    alpha,
    setAlpha,
    angleMode,
    setAngleMode,
    lastResult,
    setLastResult,
    justEvaluated,
    setJustEvaluated,
    isError,
    setIsError,
    history,
    setHistory,
    historyIndex,
    setHistoryIndex,
    toRad,
    computeExpression,
    formatDisplay,
  };
};
