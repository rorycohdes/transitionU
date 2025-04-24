import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Card } from '@/components/core/Card';
import { Text } from '@/components/core/Text';
import { Button } from '@/components/core/Button';
import { useAuth } from '@/lib/auth/AuthContext';

interface AccountTabProps {
  user: any;
}

const AccountTab: React.FC<AccountTabProps> = ({ user }) => {
  const { resetPassword, updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    try {
      const { error } = await resetPassword(user.email);
      if (error) {
        Alert.alert('Error', 'Failed to send password reset email. Please try again.');
      } else {
        Alert.alert(
          'Password Reset Email Sent',
          'Check your email for instructions to reset your password.'
        );
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  const handlePasswordChange = async () => {
    // Form validation
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (!newPassword) {
      setPasswordError('New password is required');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    try {
      // Note: This is a simplified implementation. In a real app, you would first
      // verify the current password before allowing the update.
      const { error } = await updatePassword(newPassword);

      if (error) {
        setPasswordError(error.message || 'Failed to update password');
      } else {
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        // Clear success message after a delay
        setTimeout(() => {
          setPasswordSuccess(false);
        }, 3000);
      }
    } catch (err) {
      setPasswordError('An unexpected error occurred');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      <Card>
        <Text variant="h4" weight="bold" style={styles.sectionTitle}>
          Account Security
        </Text>

        <View style={styles.section}>
          <Text variant="h5" weight="semibold">
            Email Address
          </Text>
          <Text style={styles.email}>{user?.email || 'No email available'}</Text>
          <Button
            label="Send Password Reset Email"
            variant="outline"
            size="small"
            onPress={handlePasswordReset}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text variant="h5" weight="semibold">
            Change Password
          </Text>

          <View style={styles.fieldGroup}>
            <Text variant="label" weight="medium">
              Current Password
            </Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              secureTextEntry
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text variant="label" weight="medium">
              New Password
            </Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text variant="label" weight="medium">
              Confirm New Password
            </Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry
            />
          </View>

          {passwordError && (
            <Text variant="body" color="red" style={styles.message}>
              {passwordError}
            </Text>
          )}

          {passwordSuccess && (
            <Text variant="body" color="green" style={styles.message}>
              Password updated successfully!
            </Text>
          )}

          <Button
            label={isChangingPassword ? 'Updating...' : 'Update Password'}
            variant="primary"
            onPress={handlePasswordChange}
            disabled={isChangingPassword}
            style={styles.updateButton}
          />
        </View>
      </Card>

      <Card style={styles.dangerCard}>
        <Text variant="h4" weight="bold" style={styles.sectionTitle}>
          Danger Zone
        </Text>

        <Text style={styles.dangerText}>
          Deleting your account will permanently remove all your data from our systems. This action
          cannot be undone.
        </Text>

        <Button
          label="Delete Account"
          variant="danger"
          onPress={() =>
            Alert.alert(
              'Delete Account',
              'Are you sure you want to delete your account? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () =>
                    Alert.alert(
                      'Feature Not Available',
                      'Account deletion is not available in this version.'
                    ),
                },
              ]
            )
          }
          style={styles.deleteButton}
        />
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
  email: {
    fontSize: 16,
    marginVertical: 8,
  },
  fieldGroup: {
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 4,
    backgroundColor: 'white',
  },
  updateButton: {
    marginTop: 16,
  },
  message: {
    marginTop: 8,
  },
  dangerCard: {
    marginTop: 16,
    borderColor: '#FF3B30',
  },
  dangerText: {
    marginBottom: 16,
  },
  deleteButton: {
    marginTop: 8,
  },
});

export default AccountTab;
