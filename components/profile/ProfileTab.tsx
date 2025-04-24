import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Card } from '@/components/core/Card';
import { Text } from '@/components/core/Text';
import { Button } from '@/components/core/Button';
import { VisaType } from '@/lib/models/constants';
import { UserModel } from '@/lib/models/user';
import { Picker } from '@react-native-picker/picker';

interface ProfileTabProps {
  profile: any;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ profile, isEditing, setIsEditing }) => {
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [institution, setInstitution] = useState(profile?.institution || '');
  const [major, setMajor] = useState(profile?.major || '');
  const [visaType, setVisaType] = useState(profile?.visa_type || '');
  const [homeCountry, setHomeCountry] = useState(profile?.home_country || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Reset form when profile changes
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setInstitution(profile.institution || '');
      setMajor(profile.major || '');
      setVisaType(profile.visa_type || '');
      setHomeCountry(profile.home_country || '');
    }
  }, [profile]);

  // Reset state when exiting edit mode
  useEffect(() => {
    if (!isEditing) {
      setSaveError(null);
      setSaveSuccess(false);
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (!profile?.id) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const result = await UserModel.update(profile.id, {
        firstName,
        lastName,
        institution,
        major,
        visaType,
        homeCountry,
      });

      if (result) {
        setSaveSuccess(true);
        setTimeout(() => setIsEditing(false), 1500);
      } else {
        setSaveError('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveError('An error occurred while saving your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) {
    return (
      <Card>
        <Text>No profile information available.</Text>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <View style={styles.sectionHeader}>
          <Text variant="h4" weight="bold">
            Personal Information
          </Text>
          {!isEditing && (
            <Button
              label="Edit"
              variant="outline"
              size="small"
              onPress={() => setIsEditing(true)}
            />
          )}
        </View>

        {isEditing ? (
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text variant="label" weight="medium">
                First Name
              </Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text variant="label" weight="medium">
                Last Name
              </Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text variant="label" weight="medium">
                Institution
              </Text>
              <TextInput
                style={styles.input}
                value={institution}
                onChangeText={setInstitution}
                placeholder="Enter your school/university"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text variant="label" weight="medium">
                Major
              </Text>
              <TextInput
                style={styles.input}
                value={major}
                onChangeText={setMajor}
                placeholder="Enter your field of study"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text variant="label" weight="medium">
                Visa Type
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={visaType}
                  onValueChange={(itemValue: string) => setVisaType(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select visa type" value="" />
                  <Picker.Item label="F-1 Student" value={VisaType.F1} />
                  <Picker.Item label="J-1 Exchange Visitor" value={VisaType.J1} />
                  <Picker.Item label="M-1 Vocational Student" value={VisaType.M1} />
                </Picker>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text variant="label" weight="medium">
                Home Country
              </Text>
              <TextInput
                style={styles.input}
                value={homeCountry}
                onChangeText={setHomeCountry}
                placeholder="Enter your home country"
              />
            </View>

            {saveError && (
              <Text variant="body" color="red" style={styles.message}>
                {saveError}
              </Text>
            )}

            {saveSuccess && (
              <Text variant="body" color="green" style={styles.message}>
                Profile updated successfully!
              </Text>
            )}

            <View style={styles.buttonGroup}>
              <Button
                label="Cancel"
                variant="ghost"
                onPress={() => setIsEditing(false)}
                style={styles.button}
              />
              <Button
                label={isSaving ? 'Saving...' : 'Save Changes'}
                variant="primary"
                onPress={handleSave}
                disabled={isSaving}
                style={styles.button}
              />
            </View>
          </View>
        ) : (
          <View style={styles.infoDisplay}>
            <View style={styles.infoRow}>
              <Text variant="label" weight="medium">
                First Name:
              </Text>
              <Text>{firstName || 'Not provided'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="label" weight="medium">
                Last Name:
              </Text>
              <Text>{lastName || 'Not provided'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="label" weight="medium">
                Institution:
              </Text>
              <Text>{institution || 'Not provided'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="label" weight="medium">
                Major:
              </Text>
              <Text>{major || 'Not provided'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="label" weight="medium">
                Visa Type:
              </Text>
              <Text>{visaType || 'Not provided'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="label" weight="medium">
                Home Country:
              </Text>
              <Text>{homeCountry || 'Not provided'}</Text>
            </View>
          </View>
        )}
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    marginBottom: 12,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    marginLeft: 8,
  },
  message: {
    marginTop: 8,
    textAlign: 'center',
  },
  infoDisplay: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
});

export default ProfileTab;
