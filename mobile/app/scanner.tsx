import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMuseumData } from '../src/shared/context/MuseumDataContext';
import { COLORS } from '../src/shared/theme';

export default function ScannerScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { handleQrDecoded } = useMuseumData();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const processCode = (raw: string) => {
    const res = handleQrDecoded(raw);
    if (res.ok) {
      if (res.type === 'artifact' && res.artifact) {
        router.replace(`/artifact/${encodeURIComponent(res.artifact.id)}`);
      } else {
        Alert.alert(t('appName'), t('trackEnabledByQr'));
        router.back();
      }
      return;
    }
    Alert.alert('QR không hợp lệ', 'Không tìm thấy hiện vật khớp với mã này.', [
      { text: 'Thử lại', onPress: () => setScanned(false) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraBox}>
        {!permission ? (
          <Text style={styles.infoText}>Đang kiểm tra quyền camera...</Text>
        ) : !permission.granted ? (
          <View style={styles.permBox}>
            <Text style={styles.infoText}>
              Ứng dụng cần quyền Camera để quét mã QR hiện vật.
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
              <Text style={styles.primaryBtnText}>Cấp quyền Camera</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={
              scanned
                ? undefined
                : ({ data }) => {
                    setScanned(true);
                    processCode(data);
                  }
            }
          />
        )}
      </View>

      <View style={styles.manualBox}>
        <Text style={styles.manualTitle}>Hoặc nhập mã hiện vật thủ công</Text>
        <View style={styles.manualRow}>
          <TextInput
            style={styles.input}
            value={manualCode}
            onChangeText={setManualCode}
            placeholder="Ví dụ: WRM001 hoặc AIR-F5A"
            placeholderTextColor={COLORS.textDim}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => {
              if (manualCode.trim()) processCode(manualCode.trim());
            }}
          >
            <Text style={styles.primaryBtnText}>Mở</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 16, gap: 16 },
  cameraBox: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permBox: { padding: 24, alignItems: 'center', gap: 12 },
  infoText: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center' },
  manualBox: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    gap: 10,
    marginBottom: 16,
  },
  manualTitle: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  manualRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 14,
  },
  primaryBtn: {
    backgroundColor: COLORS.amber,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: { color: COLORS.bg, fontSize: 13, fontWeight: '800' },
});
