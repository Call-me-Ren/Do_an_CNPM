import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLangStore } from '../shared/stores/langStore';
import { SupportedLanguage } from '../shared/types';
import { COLORS } from '../shared/theme';

const LANGS: { code: SupportedLanguage; label: string; short: string }[] = [
  { code: 'vi', label: 'Tiếng Việt', short: 'VI' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'zh', label: '中文', short: 'ZH' },
  { code: 'ko', label: '한국어', short: 'KO' },
  { code: 'ja', label: '日本語', short: 'JA' },
];

export const LanguageSwitcher: React.FC = () => {
  const { currentLang, setLang } = useLangStore();
  const [open, setOpen] = useState(false);

  const active = LANGS.find((l) => l.code === currentLang) ?? LANGS[0];

  return (
    <>
      <TouchableOpacity style={styles.pill} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Ionicons name="globe-outline" size={16} color={COLORS.amberLight} />
        <Text style={styles.pillText}>{active.short}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <Text style={styles.title}>Ngôn ngữ / Language</Text>
            {LANGS.map((item) => {
              const selected = item.code === currentLang;
              return (
                <TouchableOpacity
                  key={item.code}
                  style={[styles.option, selected && styles.optionActive]}
                  onPress={() => {
                    setLang(item.code);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextActive]}>
                    {item.label}
                  </Text>
                  {selected && <Ionicons name="checkmark-circle" size={20} color={COLORS.amber} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 12,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    gap: 8,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: COLORS.card,
  },
  optionActive: {
    borderWidth: 1,
    borderColor: COLORS.amber,
    backgroundColor: COLORS.amberSoft,
  },
  optionText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  optionTextActive: {
    color: COLORS.amberLight,
  },
});
