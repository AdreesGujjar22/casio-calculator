import React, { useCallback } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ButtonGrid from './components/ButtonGrid';
import Display from './components/Display';
import { COLORS } from './constants/colors';
import { useCalculator } from './hooks/useCalculator';

const App: React.FC = () => {
  const {
    display,
    expression,
    memory,
    shift,
    alpha,
    angleMode,
    lastResult,
    justEvaluated,
    isError,
    history,
    historyIndex,
    toRad,
    computeExpression,
    formatDisplay,
    setDisplay,
    setExpression,
    setMemory,
    setShift,
    setAlpha,
    setAngleMode,
    setLastResult,
    setJustEvaluated,
    setIsError,
    setHistory,
    setHistoryIndex,
  } = useCalculator();

  const handleButton = useCallback((label: string) => {
    if (isError && label !== "AC" && label !== "ON") return;

    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
    const ops = ["+", "−", "×", "÷", "^", "(", ")", ","];

    // SHIFT toggle
    if (label === "SHIFT") {
      setShift((s: boolean) => !s);
      return;
    }
    if (label === "ALPHA") {
      setAlpha((a: boolean) => !a);
      setShift(false);
      return;
    }

    // Mode / ON / CLR
    if (label === "AC" || label === "ON") {
      setDisplay("0");
      setExpression("");
      setJustEvaluated(false);
      setIsError(false);
      setShift(false);
      setAlpha(false);
      return;
    }
    if (label === "CLR") {
      if (shift) {
        setShift(false);
        setDisplay("0");
        setExpression("");
        setJustEvaluated(false);
        setIsError(false);
        setAlpha(false);
        return;
      }
      return; // Do nothing when CLR is pressed without SHIFT
    }
    if (label === "MODE") {
      if (shift) {
        setShift(false);
        // CLR functionality
        setDisplay("0");
        setExpression("");
        setJustEvaluated(false);
        setIsError(false);
        setAlpha(false);
        return;
      }
      setAngleMode((m: string) => {
        if (m === "DEG") return "RAD";
        if (m === "RAD") return "GRA";
        return "DEG";
      });
      setAlpha(false);
      return;
    }

    // DEL
    if (label === "DEL") {
      if (justEvaluated) {
        setDisplay("0");
        setExpression("");
        setJustEvaluated(false);
        return;
      }
      setExpression((prev: string) => prev.slice(0, -1));
      return;
    }

    // Scientific functions - insert function with parentheses like real calculator
    if (label === "sin" || label === "cos" || label === "tan") {
      if (shift) {
        setShift(false);
        setExpression((prev: string) => prev + `${label}⁻¹(`);
      } else {
        setExpression((prev: string) => prev + `${label}(`);
      }
      return;
    }
    if (label === "log") {
      if (shift) {
        setShift(false);
        setExpression((prev: string) => prev + "10ˣ(");
      } else {
        setExpression((prev: string) => prev + "log(");
      }
      return;
    }
    if (label === "ln") {
      if (shift) {
        setShift(false);
        setExpression((prev: string) => prev + "eˣ(");
      } else {
        setExpression((prev: string) => prev + "ln(");
      }
      return;
    }
    if (label === "√") {
      if (shift) {
        setShift(false);
        setExpression((prev: string) => prev + "³√(");
      } else {
        setExpression((prev: string) => prev + "√(");
      }
      return;
    }
    if (label === "x²") {
      setExpression((prev: string) => prev + "^(2)");
      return;
    }
    if (label === "x³") {
      setExpression((prev: string) => prev + "^(3)");
      return;
    }
    if (label === "x⁻¹") {
      setExpression((prev: string) => prev + "^(-1)");
      return;
    }
    if (label === "EXP") {
      if (shift) {
        setShift(false);
        setExpression((prev: string) => prev + "π");
      } else {
        setExpression((prev: string) => prev + "E");
      }
      return;
    }
    if (label === "(−)") {
      setExpression((prev: string) => prev + "-");
      return;
    }

    // Additional scientific functions
    if (label === "x!") {
      setExpression((prev: string) => prev + "!");
      return;
    }
    if (label === "nCr") {
      if (shift) {
        setShift(false);
        setExpression((prev: string) => prev + "nPr(");
      } else {
        setExpression((prev: string) => prev + "nCr(");
      }
      return;
    }
    if (label === "Pol(") {
      if (shift) {
        setShift(false);
        setExpression((prev: string) => prev + "Rec(");
      } else {
        setExpression((prev: string) => prev + "Pol(");
      }
      return;
    }
    if (label === "a b/c") {
      if (shift) {
        setShift(false);
        setExpression((prev: string) => prev + "d/c");
      } else {
        setExpression((prev: string) => prev + "a b/c");
      }
      return;
    }
    if (label === "^") {
      if (shift) {
        setShift(false);
        setExpression((prev: string) => prev + "xʸ√(");
      } else {
        setExpression((prev: string) => prev + "^");
      }
      return;
    }
    if (label === "°'''") {
      setExpression((prev: string) => prev + "°");
      return;
    }
    if (label === "hyp") {
      setExpression((prev: string) => prev + "hyp");
      return;
    }
    if (label === "RCL") {
      if (shift) {
        setShift(false);
        setExpression((prev: string) => prev + "STO");
      } else {
        setExpression((prev: string) => prev + memory.toString());
      }
      return;
    }
    if (label === "ENG") {
      if (shift) {
        setShift(false);
        setExpression((prev: string) => prev.slice(0, -1));
      } else {
        setExpression((prev: string) => prev + "E");
      }
      return;
    }

    // Ans - evaluates current expression immediately
    if (label === "Ans") {
      if (shift) {
        setShift(false);
        // DRG▸ - cycle angle mode
        setAngleMode((m: string) => {
          if (m === "DEG") return "RAD";
          if (m === "RAD") return "GRA";
          return "DEG";
        });
        return;
      }
      
      const expr = expression || display;
      if (!expr || expr === "0") return;
      
      // Auto-close brackets
      let finalExpr = expr;
      const openBrackets = (expr.match(/\(/g) || []).length - (expr.match(/\)/g) || []).length;
      for (let i = 0; i < openBrackets; i++) {
        finalExpr += ')';
      }
      
      const result = computeExpression(finalExpr);
      if (typeof result === "string" && result.includes("ERROR")) {
        setDisplay(result);
        setIsError(true);
        return;
      }
      const formatted = formatDisplay(result);
      setDisplay(formatted);
      setExpression(finalExpr + "="); // Show expression with equal sign
      if (typeof result === 'number') {
        setLastResult(result);
      }
      setJustEvaluated(true);
      
      // Add to history
      setHistory((prev: string[]) => {
        const newHistory = [...prev];
        if (newHistory.length === 0 || newHistory[newHistory.length - 1] !== expr) {
          newHistory.push(expr);
        }
        return newHistory;
      });
      return;
    }

    // Rnd and Ran# functions
    if (label === "0") {
      if (shift) {
        setShift(false);
        // Rnd - Random number between 0 and 1
        const randomNum = Math.random();
        setDisplay(randomNum.toString());
        setExpression(randomNum.toString());
        setJustEvaluated(true);
        return;
      }
    }
    if (label === ".") {
      if (shift) {
        setShift(false);
        // Ran# - Random integer between 0 and 999
        const randomInt = Math.floor(Math.random() * 1000);
        setDisplay(randomInt.toString());
        setExpression(randomInt.toString());
        setJustEvaluated(true);
        return;
      }
    }

    // S-SUM and S-VAR functions
    if (label === "1") {
      if (shift) {
        setShift(false);
        // S-SUM - Sum of statistical data
        setExpression("S-SUM");
        setDisplay("0");
        setJustEvaluated(true);
        return;
      }
    }
    if (label === "2") {
      if (shift) {
        setShift(false);
        // S-VAR - Statistical variance
        setExpression("S-VAR");
        setDisplay("0");
        setJustEvaluated(true);
        return;
      }
    }

    // Digits and operators
    if (digits.includes(label)) {
      if (justEvaluated) {
        setExpression(label === "." ? "0." : label);
        setDisplay("0"); // Reset display to show 0 while building new expression
        setJustEvaluated(false);
        return;
      }
      setExpression((prev: string) => prev + label);
      return;
    }

    if (ops.includes(label)) {
      const op = label === "−" ? "-" : label;
      if (justEvaluated && lastResult !== null) {
        setExpression(lastResult.toString() + op);
        setDisplay("0"); // Reset display to show 0 while building new expression
        setJustEvaluated(false);
        return;
      }
      setExpression((prev: string) => prev + op);
      return;
    }

    // Equals
    if (label === "=") {
      const expr = expression || display;
      if (!expr || expr === "0") return;
      
      // Auto-close brackets
      let finalExpr = expr;
      const openBrackets = (expr.match(/\(/g) || []).length - (expr.match(/\)/g) || []).length;
      for (let i = 0; i < openBrackets; i++) {
        finalExpr += ')';
      }
      
      const result = computeExpression(finalExpr);
      if (typeof result === "string" && result.includes("ERROR")) {
        setDisplay(result);
        setIsError(true);
        return;
      }
      const formatted = formatDisplay(result);
      setDisplay(formatted);
      setExpression(finalExpr + "="); // Show expression with equal sign
      // Only set lastResult if it's a valid number
      if (typeof result === 'number') {
        setLastResult(result);
      }
      setJustEvaluated(true);
      
      // Add to history
      setHistory((prev: string[]) => {
        const newHistory = [...prev];
        if (newHistory.length === 0 || newHistory[newHistory.length - 1] !== expr) {
          newHistory.push(expr);
        }
        return newHistory;
      });
      return;
    }

    // REPLAY functionality
    if (label === "REPLAY") {
      if (history.length === 0) return;
      
      setHistoryIndex((prev: number) => {
        const newIndex = (prev + 1) % history.length;
        const historyItem = history[newIndex];
        setDisplay(historyItem || "0");
        setExpression(historyItem || "0");
        setJustEvaluated(false);
        setIsError(false);
        return newIndex;
      });
      return;
    }

    // Memory functions
    if (label === "M+") {
      if (shift) {
        setShift(false);
        setMemory((m: number) => m - (lastResult ?? parseFloat(display) ?? 0));
      } else {
        setMemory((m: number) => m + (lastResult ?? parseFloat(display) ?? 0));
      }
      return;
    }
    if (label === "M-") {
      if (shift) {
        setShift(false);
        setMemory(0); // MC - Memory Clear
      } else {
        setMemory((m: number) => m - (lastResult ?? parseFloat(display) ?? 0));
      }
      return;
    }
    if (label === "STO") {
      const currentValue = lastResult ?? parseFloat(display) ?? 0;
      setMemory(currentValue);
      return;
    }
  }, [
    display,
    expression,
    shift,
    alpha,
    memory,
    angleMode,
    lastResult,
    justEvaluated,
    isError,
    history,
    historyIndex,
    computeExpression,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.CASE_TOP} />
      <View style={styles.calculatorContainer}>
        <View style={styles.calculatorBody}>
          {/* Top Section - Brand & Solar */}
          <View style={styles.topSection}>
            <View style={styles.brandSection}>
              <Text style={styles.casioText}>CASIO</Text>
              <Text style={styles.modelText}>fx-300MS</Text>
              <Text style={styles.svpamText}>S-V.P.A.M.</Text>
            </View>
            
            {/* Solar panel */}
            <View style={styles.solarPanel}>
              {Array.from({ length: 32 }).map((_, index) => (
                <View key={index} style={styles.solarCell} />
              ))}
            </View>
          </View>

          {/* TWO WAY POWER label */}
          <Text style={styles.powerLabel}>TWO WAY POWER</Text>

          {/* Display */}
          <Display
            display={display}
            expression={expression}
            shift={shift}
            alpha={alpha}
            angleMode={angleMode}
            memory={memory}
          />

          {/* Button Grid */}
          <ButtonGrid onPress={handleButton} />

          {/* Bottom rounded bump */}
          <View style={styles.bottomBump} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_BG,
  },
  calculatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  calculatorBody: {
    backgroundColor: COLORS.CASE_TOP,
    borderRadius: 14,
    padding: 10,
    paddingTop: 10,
    paddingBottom: 36,
    width: '100%',
    maxWidth: 360,
    height: '100%',
    maxHeight: 720,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.7,
    shadowRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.4)',
    position: 'relative',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingHorizontal: 2,
    minHeight: 44,
  },
  brandSection: {
    justifyContent: 'flex-start',
  },
  casioText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
    fontWeight: '900' as const,
    letterSpacing: 0.8,
    fontFamily: 'Arial',
  },
  modelText: {
    color: COLORS.TEXT_LIGHT,
    opacity: 0.8,
    fontSize: 8,
    marginTop: 1,
    fontStyle: 'italic',
    fontFamily: 'Arial',
  },
  svpamText: {
    color: '#c06080',
    fontSize: 7,
    fontWeight: '800' as const,
    letterSpacing: 0.4,
    fontFamily: 'Arial',
  },
  solarPanel: {
    width: 90,
    height: 26,
    backgroundColor: '#1a0404',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  solarCell: {
    width: 9,
    height: 4,
    backgroundColor: 'rgba(10,10,10,0.35)',
    borderRadius: 1,
    margin: 0.5,
  },
  powerLabel: {
    textAlign: 'right',
    color: COLORS.TEXT_LIGHT,
    opacity: 0.6,
    fontSize: 6,
    marginBottom: 3,
    paddingRight: 4,
    letterSpacing: 0.4,
    fontFamily: 'Arial',
    fontWeight: '500' as const,
  },
  bottomBump: {
    position: 'absolute',
    bottom: -2,
    left: '5%',
    right: '5%',
    height: 24,
    backgroundColor: COLORS.CASE_LIP,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.35)',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default App;
