import React from 'react';
import { StyleSheet, View } from 'react-native';
import CalculatorButton from './CalculatorButton';

interface ButtonGridProps {
  onPress: (label: string) => void;
}

const ButtonGrid: React.FC<ButtonGridProps> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      {/* Row 1: SHIFT, ALPHA, REPLAY, MODE, ON */}
      <View style={styles.row}>
        <CalculatorButton label="SHIFT" color="white"  onPress={() => onPress('SHIFT')} />
        <CalculatorButton label="ALPHA" color="white"  onPress={() => onPress('ALPHA')} />
        <CalculatorButton label="REPLAY" color="white"  flex={2} onPress={() => onPress('REPLAY')} />
        <CalculatorButton label="MODE" topLabel="CLR" color="white"  onPress={() => onPress('MODE')} />
        <CalculatorButton label="ON" color="white"  onPress={() => onPress('ON')} />
      </View>

      {/* Row 2: x⁻¹/x!, nCr/nPr, [space], Pol(/Rec(, x³/³√ */}
      <View style={styles.row}>
        <CalculatorButton label="x⁻¹" topLabel="x!" color="func" onPress={() => onPress('x⁻¹')} />
        <CalculatorButton label="nCr" topLabel="nPr" color="func" onPress={() => onPress('nCr')} />
        <CalculatorButton label="" color="spacer" onPress={() => {}} />
        <CalculatorButton label="Pol(" topLabel="Rec(" color="func" onPress={() => onPress('Pol(')} />
        <CalculatorButton label="x³" topLabel="³√" color="func" onPress={() => onPress('x³')} />
      </View>

      {/* Row 3: a b/c/d/c, √, x², ^/xʸ√, log/10ˣ, ln/eˣ */}
      <View style={styles.row}>
        <CalculatorButton label="a b/c" topLabel="d/c" color="func" onPress={() => onPress('a b/c')} />
        <CalculatorButton label="√" color="func" onPress={() => onPress('√')} />
        <CalculatorButton label="x²" color="func" onPress={() => onPress('x²')} />
        <CalculatorButton label="^" topLabel="xʸ√" color="func" onPress={() => onPress('^')} />
        <CalculatorButton label="log" topLabel="10ˣ" color="func" onPress={() => onPress('log')} />
        <CalculatorButton label="ln" topLabel="eˣ" color="func" onPress={() => onPress('ln')} />
      </View>

      {/* Row 4: (−)/A, °'''/B, hyp/C, sin/sin⁻¹, cos/cos⁻¹, tan/tan⁻¹ */}
      <View style={styles.row}>
        <CalculatorButton label="(−)" topLabel="A" color="func" onPress={() => onPress('(−)')} />
        <CalculatorButton label="°'''" topLabel="B" color="func" onPress={() => onPress('°\'\'\'')} />
        <CalculatorButton label="hyp" topLabel="C" color="func" onPress={() => onPress('hyp')} />
        <CalculatorButton label="sin" topLabel="sin⁻¹" color="func" onPress={() => onPress('sin')} />
        <CalculatorButton label="cos" topLabel="cos⁻¹" color="func" onPress={() => onPress('cos')} />
        <CalculatorButton label="tan" topLabel="tan⁻¹" color="func" onPress={() => onPress('tan')} />
      </View>

      {/* Row 5: RCL/STO, ENG/←, (/X, )/;, ,/Y, M+/M− */}
      <View style={styles.row}>
        <CalculatorButton label="RCL" topLabel="STO" color="func" onPress={() => onPress('RCL')} />
        <CalculatorButton label="ENG" topLabel="←" color="func" onPress={() => onPress('ENG')} />
        <CalculatorButton label="(" topLabel="X" color="func" onPress={() => onPress('(')} />
        <CalculatorButton label=")" topLabel=";" color="func" onPress={() => onPress(')')} />
        <CalculatorButton label="," topLabel="Y" color="func" onPress={() => onPress(',')} />
        <CalculatorButton label="M+" topLabel="M−" color="func" onPress={() => onPress('M+')} />
      </View>

      {/* Row 6: 7, 8, 9, DEL, AC */}
      <View style={styles.row}>
        <CalculatorButton label="7" color="num"  onPress={() => onPress('7')} />
        <CalculatorButton label="8" color="num"  onPress={() => onPress('8')} />
        <CalculatorButton label="9" color="num"  onPress={() => onPress('9')} />
        <CalculatorButton label="DEL" topLabel="INS" color="del"  onPress={() => onPress('DEL')} />
        <CalculatorButton label="AC" topLabel="OFF" color="ac"  onPress={() => onPress('AC')} />
      </View>

      {/* Row 7: 4, 5, 6, ×, ÷ */}
      <View style={styles.row}>
        <CalculatorButton label="4" color="num"  onPress={() => onPress('4')} />
        <CalculatorButton label="5" color="num"  onPress={() => onPress('5')} />
        <CalculatorButton label="6" color="num"  onPress={() => onPress('6')} />
        <CalculatorButton label="×" color="num"  onPress={() => onPress('×')} />
        <CalculatorButton label="÷" color="num"  onPress={() => onPress('÷')} />
      </View>

      {/* Row 8: 1, 2, 3, +, − */}
      <View style={styles.row}>
        <CalculatorButton label="1" topLabel="S-SUM" color="num"  onPress={() => onPress('1')} />
        <CalculatorButton label="2" topLabel="S-VAR" color="num"  onPress={() => onPress('2')} />
        <CalculatorButton label="3" color="num"  onPress={() => onPress('3')} />
        <CalculatorButton label="+" color="num"  onPress={() => onPress('+')} />
        <CalculatorButton label="−" color="num"  onPress={() => onPress('−')} />
      </View>

      {/* Row 9: 0, ., EXP, Ans, = */}
      <View style={styles.row}>
        <CalculatorButton label="0" topLabel="Rnd" color="num"  onPress={() => onPress('0')} />
        <CalculatorButton label="." topLabel="Ran#" color="num"  onPress={() => onPress('.')} />
        <CalculatorButton label="EXP" topLabel="π" color="num"  onPress={() => onPress('EXP')} />
        <CalculatorButton label="Ans" topLabel="DRG▸" color="num"  onPress={() => onPress('Ans')} />
        <CalculatorButton label="=" color="num"  onPress={() => onPress('=')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    paddingHorizontal: 4,
    paddingBottom: 2,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'stretch',
    marginBottom: 3,
  },
});

export default ButtonGrid;
