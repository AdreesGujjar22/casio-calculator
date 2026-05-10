import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import { COLORS } from '../constants/colors';

interface CalculatorButtonProps {
  label: string;
  onPress: () => void;
  color?: 'func' | 'num' | 'del' | 'ac' | 'white' | 'spacer';
  topLabel?: string;
  bottomLabel?: string;
  topLabelColor?: string;
  flex?: number;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  label,
  onPress,
  color = 'func',
  topLabel,
  bottomLabel,
  topLabelColor,
  flex = 1,
}) => {
  if (color === 'spacer') {
    return <View style={{ flex }} />;
  }

  const getButtonColors = () => {
    switch (color) {
      case 'num':
        return { bg: COLORS.BUTTON_NUM, text: COLORS.BUTTON_NUM_TEXT, shadow: COLORS.BUTTON_NUM_SHADOW };
      case 'del':
        return { bg: COLORS.BUTTON_DEL, text: '#fff', shadow: COLORS.BUTTON_DEL_SHADOW };
      case 'ac':
        return { bg: COLORS.BUTTON_AC, text: '#fff', shadow: COLORS.BUTTON_AC_SHADOW };
      case 'white':
        return { bg: COLORS.BUTTON_WHITE, text: COLORS.BUTTON_WHITE_TEXT, shadow: COLORS.BUTTON_WHITE_SHADOW };
      case 'func':
      default:
        return { bg: COLORS.BUTTON_FUNC, text: COLORS.BUTTON_FUNC_TEXT, shadow: COLORS.BUTTON_FUNC_SHADOW };
    }
  };

  const btn = getButtonColors();

  return (
    <View style={[styles.outer, { flex }]}>
      {/* Shadow layer underneath */}
      <View style={[styles.shadow, { backgroundColor: btn.shadow }]} />
      
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: btn.bg },
          pressed && styles.pressed,
        ]}
        onPress={() => {
          Vibration.vibrate(12);
          onPress();
        }}
        android_ripple={{ color: 'rgba(0,0,0,0.15)', foreground: true }}
      >
        <View style={styles.content} pointerEvents="none">
          {topLabel && (
            <Text style={[styles.topLabel, { color: topLabelColor || COLORS.LABEL_SHIFT }]} numberOfLines={1}>
              {topLabel}
            </Text>
          )}
          {bottomLabel && (
            <Text style={[styles.bottomLabel, { color: COLORS.LABEL_ALPHA }]} numberOfLines={1}>
              {bottomLabel}
            </Text>
          )}
          <Text style={[styles.label, { color: btn.text }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    position: 'relative',
    margin: 1.5,
  },
  shadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -3,
    height: '100%',
    borderRadius: 8,
  },
  button: {
    position: 'relative',
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // Slight top highlight for 3D effect
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  pressed: {
    transform: [{ translateY: 2 }],
    opacity: 0.9,
  },
  content: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Arial',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  topLabel: {
    position: 'absolute',
    top: 2,
    left: 4,
    fontSize: 7,
    fontWeight: '800',
    fontFamily: 'Arial',
    letterSpacing: 0.2,
    lineHeight: 8,
  },
  bottomLabel: {
    position: 'absolute',
    bottom: 2,
    left: 4,
    fontSize: 7,
    fontWeight: '800',
    fontFamily: 'Arial',
    letterSpacing: 0.2,
    lineHeight: 8,
  },
});

export default CalculatorButton;
