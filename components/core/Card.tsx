import React from 'react';
import { View, StyleSheet, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import Theme from '../../constants/Theme';

export type CardVariant = 'elevated' | 'outlined' | 'filled';
export type CardPadding = 'none' | 'small' | 'medium' | 'large';

export interface CardProps extends ViewProps {
  /**
   * Card visual variant
   */
  variant?: CardVariant;
  /**
   * Card padding
   */
  padding?: CardPadding;
  /**
   * Card border radius
   */
  borderRadius?: keyof typeof Theme.borderRadius;
  /**
   * Additional styles for the card container
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Children components
   */
  children: React.ReactNode;
}

/**
 * A customizable card component for displaying content in a contained area
 */
export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'medium',
  borderRadius = 'md',
  containerStyle,
  style,
  children,
  ...rest
}) => {
  const backgroundColor = useThemeColor({}, 'background');
  const isDark = backgroundColor === Theme.colors.dark.background;

  // Get variant-specific styles
  const getVariantStyle = (): StyleProp<ViewStyle> => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: backgroundColor,
          borderWidth: 0,
          ...Theme.shadow[isDark ? 'dark' : 'light'].md,
        };
      case 'outlined':
        return {
          backgroundColor: backgroundColor,
          borderWidth: 1,
          borderColor: isDark ? '#3F4446' : '#E2E8F0',
        };
      case 'filled':
        return {
          backgroundColor: isDark ? '#2C2F30' : '#F7FAFC',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: backgroundColor,
          borderWidth: 0,
          ...Theme.shadow[isDark ? 'dark' : 'light'].md,
        };
    }
  };

  // Get padding based on size
  const getPaddingStyle = (): StyleProp<ViewStyle> => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'small':
        return { padding: Theme.spacing.sm };
      case 'large':
        return { padding: Theme.spacing.lg };
      case 'medium':
      default:
        return { padding: Theme.spacing.md };
    }
  };

  const cardStyles: StyleProp<ViewStyle> = [
    styles.card,
    getVariantStyle(),
    getPaddingStyle(),
    { borderRadius: Theme.borderRadius[borderRadius] },
    containerStyle,
  ];

  return (
    <View style={cardStyles} {...rest}>
      <View style={[styles.content, style]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  content: {
    width: '100%',
  },
});
