import React from 'react';
import {
  Text as RNText,
  StyleSheet,
  TextStyle,
  StyleProp,
  TextProps as RNTextProps,
} from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import Theme from '../../constants/Theme';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'label' | 'caption';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TextAlign = 'auto' | 'left' | 'right' | 'center' | 'justify';

export interface TextProps extends RNTextProps {
  /**
   * Text content
   */
  children?: React.ReactNode;
  /**
   * Text variant
   */
  variant?: TextVariant;
  /**
   * Text weight
   */
  weight?: TextWeight;
  /**
   * Text color (uses theme colors by default)
   */
  color?: string;
  /**
   * Text alignment
   */
  align?: TextAlign;
  /**
   * Whether the text should be italic
   */
  italic?: boolean;
  /**
   * Whether the text should be underlined
   */
  underline?: boolean;
  /**
   * Whether the text should be struck through
   */
  strikethrough?: boolean;
  /**
   * Whether the text should be all uppercase
   */
  uppercase?: boolean;
  /**
   * Additional style for the text
   */
  style?: StyleProp<TextStyle>;
}

/**
 * A themed text component that supports different variants, weights, and styles
 */
export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  weight = 'regular',
  color,
  align,
  italic,
  underline,
  strikethrough,
  uppercase,
  style,
  ...props
}) => {
  const themeColor = useThemeColor({}, 'text');
  const textColor = color || themeColor;

  // Get variant-specific styles
  const getVariantStyle = (): StyleProp<TextStyle> => {
    const variantMap: Record<TextVariant, StyleProp<TextStyle>> = {
      h1: {
        fontFamily: Theme.typography.fontFamily.sans,
        fontSize: Theme.typography.fontSize.xxxl,
        lineHeight: Theme.typography.lineHeight.xxxl,
      },
      h2: {
        fontFamily: Theme.typography.fontFamily.sans,
        fontSize: Theme.typography.fontSize.xxl,
        lineHeight: Theme.typography.lineHeight.xxl,
      },
      h3: {
        fontFamily: Theme.typography.fontFamily.sans,
        fontSize: Theme.typography.fontSize.xl,
        lineHeight: Theme.typography.lineHeight.xl,
      },
      h4: {
        fontFamily: Theme.typography.fontFamily.sans,
        fontSize: Theme.typography.fontSize.lg,
        lineHeight: Theme.typography.lineHeight.lg,
      },
      h5: {
        fontFamily: Theme.typography.fontFamily.sans,
        fontSize: Theme.typography.fontSize.md,
        lineHeight: Theme.typography.lineHeight.md,
      },
      h6: {
        fontFamily: Theme.typography.fontFamily.sans,
        fontSize: Theme.typography.fontSize.sm,
        lineHeight: Theme.typography.lineHeight.sm,
      },
      body: {
        fontFamily: Theme.typography.fontFamily.sans,
        fontSize: Theme.typography.fontSize.md,
        lineHeight: Theme.typography.lineHeight.md,
      },
      label: {
        fontFamily: Theme.typography.fontFamily.sans,
        fontSize: Theme.typography.fontSize.sm,
        lineHeight: Theme.typography.lineHeight.sm,
      },
      caption: {
        fontFamily: Theme.typography.fontFamily.sans,
        fontSize: Theme.typography.fontSize.xs,
        lineHeight: Theme.typography.lineHeight.xs,
      },
    };

    return variantMap[variant];
  };

  // Get weight-specific font family
  const getWeightStyle = (): StyleProp<TextStyle> => {
    const weightMap: Record<TextWeight, StyleProp<TextStyle>> = {
      regular: {
        fontWeight: Theme.typography.fontWeight.regular,
      },
      medium: {
        fontWeight: Theme.typography.fontWeight.medium,
      },
      semibold: {
        fontWeight: Theme.typography.fontWeight.semibold,
      },
      bold: {
        fontWeight: Theme.typography.fontWeight.bold,
      },
    };

    return weightMap[weight];
  };

  // Combine all styles
  const textStyles: StyleProp<TextStyle> = [
    styles.text,
    getVariantStyle(),
    getWeightStyle(),
    {
      color: textColor,
      textAlign: align,
      fontStyle: italic ? 'italic' : 'normal',
      textDecorationLine: underline
        ? strikethrough
          ? 'underline line-through'
          : 'underline'
        : strikethrough
          ? 'line-through'
          : 'none',
      textTransform: uppercase ? 'uppercase' : 'none',
    },
    style,
  ];

  return (
    <RNText style={textStyles} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    // Base text styles
  },
});
