import { Barlow_400Regular, Barlow_500Medium, Barlow_600SemiBold } from '@expo-google-fonts/barlow';
import { ChakraPetch_600SemiBold, ChakraPetch_700Bold } from '@expo-google-fonts/chakra-petch';
import { JetBrainsMono_400Regular, JetBrainsMono_600SemiBold } from '@expo-google-fonts/jetbrains-mono';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { ActivityIndicator, Pressable, ScrollView, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Txt } from './src/components/ui';
import CompassScreen from './src/screens/CompassScreen';
import MapScreen from './src/screens/MapScreen';
import MemoScreen from './src/screens/MemoScreen';
import PackScreen from './src/screens/PackScreen';
import { usePersist } from './src/storage';
import { dark, light, ThemeCtx, useTheme } from './src/theme';

type TabKey = 'compass' | 'map' | 'pack' | 'memo';
const TABS: { key: TabKey; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { key: 'compass', label: 'Boussole', icon: 'compass-outline' },
  { key: 'map', label: 'Carte', icon: 'map-outline' },
  { key: 'pack', label: 'Paquetage', icon: 'bag-outline' },
  { key: 'memo', label: 'Mémo', icon: 'document-text-outline' },
];

function Header() {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: t.line2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 40, height: 40, borderWidth: 1, borderColor: t.acc, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="navigate-outline" size={20} color={t.acc} />
        </View>
        <View>
          <Txt font="dispBold" size={24} caps spacing={7}>Azimut</Txt>
          <Txt font="mono" size={10.5} dim caps spacing={1.2}>Orientation · Paquetage</Txt>
        </View>
      </View>
      <View style={{ borderWidth: 1, borderColor: t.warn, paddingHorizontal: 7, paddingVertical: 4 }}>
        <Txt font="mono" size={9.5} color={t.warn} caps spacing={1.3}>Non officielle</Txt>
      </View>
    </View>
  );
}

function Main() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = usePersist<TabKey>('tab', 'compass');
  const scroll = useRef<any>(null);
  const Screen = tab === 'compass' ? CompassScreen : tab === 'map' ? MapScreen : tab === 'pack' ? PackScreen : MemoScreen;
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar style={t.dark ? 'light' : 'dark'} />
      <ScrollView
        ref={scroll}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 96,
          paddingLeft: Math.max(16, insets.left),
          paddingRight: Math.max(16, insets.right),
          width: '100%',
          maxWidth: 560,
          alignSelf: 'center',
          gap: 14,
        }}
      >
        <Header />
        <Screen />
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: t.bg,
          borderTopWidth: 1,
          borderTopColor: t.line2,
          paddingBottom: insets.bottom + 6,
          paddingTop: 0,
          paddingHorizontal: 10,
        }}
      >
        {TABS.map((x) => {
          const on = x.key === tab;
          return (
            <Pressable
              key={x.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              onPress={() => {
                setTab(x.key);
                scroll.current?.scrollTo({ y: 0, animated: false });
              }}
              style={{ flex: 1, maxWidth: 130, alignItems: 'center', gap: 3, paddingTop: 8, paddingBottom: 4, borderTopWidth: 2, borderTopColor: on ? t.acc : 'transparent' }}
            >
              <Ionicons name={x.icon} size={21} color={on ? t.acc : t.faint} />
              <Txt font="disp" size={10.5} caps spacing={1.4} color={on ? t.acc : t.faint}>{x.label}</Txt>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? dark : light;
  const [loaded] = useFonts({
    Barlow_400Regular,
    Barlow_500Medium,
    Barlow_600SemiBold,
    ChakraPetch_600SemiBold,
    ChakraPetch_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_600SemiBold,
  });
  return (
    <SafeAreaProvider>
      <ThemeCtx.Provider value={theme}>
        {loaded ? (
          <Main />
        ) : (
          <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={theme.acc} />
          </View>
        )}
      </ThemeCtx.Provider>
    </SafeAreaProvider>
  );
}
