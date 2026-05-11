import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

interface DisplayProps {
  display: string;
  expression: string;
  shift: boolean;
  alpha: boolean;
  angleMode: 'DEG' | 'RAD' | 'GRA';
  memory: number;
}

const Display: React.FC<DisplayProps> = ({ display, expression, shift, alpha, angleMode, memory }) => {
  return (
    <View style={styles.display}>
      {/* Mode indicators - positioned at top right like the image */}
      <View style={styles.modeIndicators}>
        <View style={styles.modeIndicatorGroup}>
          {shift && <Text style={[styles.modeText, styles.shiftText]}>S</Text>}
          {alpha && <Text style={[styles.modeText, styles.alphaText]}>A</Text>}
        </View>
        <Text style={styles.modeText}>{angleMode}</Text>
        {memory !== 0 && <Text style={styles.modeText}>M</Text>}
      </View>
      
      {/* Expression line (top) - scrollable for long text */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.expressionText}>
          {expression || ''}
        </Text>
      </ScrollView>
      
      {/* Result line (bottom) - scrollable for long digits */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.displayText}>
          {display || '0'}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  display: {
    backgroundColor: COLORS.DISPLAY_BG,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 4,
    borderColor: COLORS.DISPLAY_FRAME,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    minHeight: 72,
    maxHeight: 88,
    position: 'relative',
  },
  modeIndicators: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 4,
    minHeight: 12,
  },
  modeIndicatorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeText: {
    fontSize: 8,
    color: COLORS.DISPLAY_INDICATOR,
    fontWeight: '700' as const,
    fontFamily: 'monospace',
    marginLeft: 6,
  },
  shiftText: {
    color: '#d4b041',
  },
  alphaText: {
    color: '#d06080',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  expressionText: {
    fontSize: 19,
    color: COLORS.DISPLAY_TEXT,
    textAlign: 'right',
    lineHeight: 15,
    letterSpacing: 0.6,
    minHeight: 15,
    fontFamily: 'monospace',
    fontWeight: '500' as const,
    opacity: 0.75,
    paddingLeft: 20,
  },
  displayText: {
    fontSize: 24,
    color: COLORS.DISPLAY_TEXT,
    textAlign: 'right',
    lineHeight: 28,
    letterSpacing: 0.6,
    minHeight: 28,
    fontFamily: 'monospace',
    fontWeight: '600' as const,
    paddingLeft: 20,
  },
});

export default Display;
