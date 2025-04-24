import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import Theme from '../../constants/Theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends TouchableOpacityProps {
  /**
   * Button label text
   */
  label: string;
  /**
   * Button visual variant
   */
  variant?: ButtonVariant;
  /**
   * Button size
   */
  size?: ButtonSize;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Icon to display at the start of the button
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to display at the end of the button
   */
  rightIcon?: React.ReactNode;
  /**
   * Button width fills container
   */
  fullWidth?: boolean;
}

/**
 * A customizable button component that follows the design system
 */
export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  ...rest
}) => {
  const themeColor = useThemeColor({}, 'background');
  const isDark = themeColor === Theme.colors.dark.background;

  // Get variant-specific styles
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? '#A0A0A0' : '#007AFF',
          borderColor: disabled ? '#A0A0A0' : '#007AFF',
          borderWidth: 1,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? '#F0F0F0' : '#E0E0E0',
          borderColor: disabled ? '#F0F0F0' : '#E0E0E0',
          borderWidth: 1,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: disabled ? '#A0A0A0' : '#007AFF',
          borderWidth: 1,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 1,
        };
      case 'danger':
        return {
          backgroundColor: disabled ? '#FFCCCC' : '#FF3B30',
          borderColor: disabled ? '#FFCCCC' : '#FF3B30',
          borderWidth: 1,
        };
      default:
        return {};
    }
  };

  // Get size-specific styles
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: Theme.spacing.xs,
          paddingHorizontal: Theme.spacing.md,
          fontSize: Theme.typography.fontSize.sm,
          borderRadius: Theme.borderRadius.md,
        };
      case 'large':
        return {
          paddingVertical: Theme.spacing.md,
          paddingHorizontal: Theme.spacing.xl,
          fontSize: Theme.typography.fontSize.lg,
          borderRadius: Theme.borderRadius.lg,
        };
      case 'medium':
      default:
        return {
          paddingVertical: Theme.spacing.sm,
          paddingHorizontal: Theme.spacing.lg,
          fontSize: Theme.typography.fontSize.md,
          borderRadius: Theme.borderRadius.md,
        };
    }
  };

  const variantStyle = getVariantStyle();
  const sizeStyle = getSizeStyle();

  const buttonStyles: StyleProp<ViewStyle> = [
    styles.button,
    {
      backgroundColor: variantStyle.backgroundColor,
      borderColor: variantStyle.borderColor,
      borderRadius: sizeStyle.borderRadius,
      paddingVertical: sizeStyle.paddingVertical,
      paddingHorizontal: sizeStyle.paddingHorizontal,
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
    },
    style,
  ];

  // Define text color based on variant
  const getTextColor = () => {
    if (disabled) {
      return variant === 'outline' || variant === 'ghost' ? '#A0A0A0' : '#FFFFFF';
    }

    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return '#333333';
      case 'outline':
        return '#007AFF';
      case 'ghost':
        return '#007AFF';
      case 'danger':
        return '#FFFFFF';
      default:
        return '#333333';
    }
  };

  const textStyles: StyleProp<TextStyle> = [
    styles.text,
    {
      color: getTextColor(),
      fontSize: sizeStyle.fontSize,
      opacity: loading ? 0 : 1,
    },
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      <View style={styles.contentContainer}>
        {loading && (
          <ActivityIndicator color={getTextColor()} size="small" style={styles.loadingIndicator} />
        )}
        <View style={styles.contentWrapper}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={textStyles}>{label}</Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: Theme.spacing.xs,
  },
  rightIcon: {
    marginLeft: Theme.spacing.xs,
  },
});
