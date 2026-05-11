import React, { useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
  type DimensionValue,
} from 'react-native';
import { COLORS } from '../constants/colors';
import SoundService from '../services/SoundService';

interface CalculatorButtonProps {
  label: string;
  onPress: () => void;
  color?: 'func' | 'num' | 'del' | 'ac' | 'white' | 'spacer';
  topLabel?: string;
  bottomLabel?: string;
  topLabelColor?: string;
  flex?: number;
  height?: DimensionValue;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  label,
  onPress,
  color = 'func',
  topLabel,
  bottomLabel,
  topLabelColor,
  flex = 1,
  height = '80%',
}) => {
  useEffect(() => {
    // Initialize the shared sound service
    SoundService.getInstance().loadSound();
  }, []);

  const playClickSound = async () => {
    SoundService.getInstance().playClickSound();
  };

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
    <View style={[styles.outer, { flex, height: height }]}>
      {/* Top label outside the button */}
      {topLabel && (
        <Text style={[styles.outerTopLabel, { color: topLabelColor || COLORS.LABEL_SHIFT }]} numberOfLines={1}>
          {topLabel}
        </Text>
      )}

      {/* Shadow layer underneath */}
      <View style={[styles.shadow, { backgroundColor: btn.shadow }]} />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: btn.bg,
            transform: [{ translateY: pressed ? 2 : 0 }],
          },
        ]}
        onPress={() => {
          Vibration.vibrate(12);
          playClickSound();
          onPress();
        }}
        android_ripple={{ color: 'rgba(0,0,0,0.15)', foreground: true }}
      >
        <View style={styles.content} pointerEvents="none">
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
    marginHorizontal: 3,
    marginVertical: 4,
    justifyContent: 'flex-start',
  },

  // Bottom plastic depth layer
  shadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -2,
    top: 2,
    borderRadius: 7,
    opacity: 1,
  },

  button: {
    flex: 1,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    // Main plastic feel
    borderTopWidth: 1.2,
    borderLeftWidth: 1,
    borderRightWidth: 1,

    borderTopColor: 'rgba(255,255,255,0.18)',
    borderLeftColor: 'rgba(255,255,255,0.08)',
    borderRightColor: 'rgba(0,0,0,0.12)',

    // Slight inset look
    borderBottomWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.35)',
  },

  pressed: {
    transform: [{ translateY: 2 }],
  },

  content: {
    width: '100%',
    top: 2,
    bottom: -2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 1,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',

    // Casio-like compact text
    letterSpacing: -0.2,

    textAlign: 'center',
  },

  outerTopLabel: {
    position: 'absolute',
    top: -11,
    left: 0,
    right: 0,

    fontSize: 9,
    fontWeight: '800',

    letterSpacing: -0.1,
    lineHeight: 10,

    textAlign: 'center',
  },

  bottomLabel: {
    position: 'absolute',
    bottom: 1,
    left: 4,

    fontSize: 6.5,
    fontWeight: '800',

    letterSpacing: -0.1,
    lineHeight: 7,
  },
});

export default CalculatorButton;
