import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useDashboard } from '../context/DashboardContext';
import { Colors, StyledContainer, InnerContainer, PageTitle, SubTitle } from '../components/style';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { brand, darkLight, tertiary } = Colors;

const initialMessages = [
  {
    id: 'msg-1',
    sender: 'user',
    text: 'My PC is running extremely slow today. It takes forever to open simple apps like Chrome. Can you help me troubleshoot?',
    timestamp: '13:30',
  },
  {
    id: 'msg-2',
    sender: 'ai',
    text: "I've analyzed your system vitals. Your CPU usage is spiking with heavy disk I/O. Let's resolve this with these steps:",
    timestamp: '13:31',
    steps: [
      'Open Task Manager and identify processes with high CPU or memory.',
      'Clear temporary files and system caches.',
      'Inspect fans and ventilation for overheating.',
    ],
    hasSafetyWarning: true,
    recommendedVideo: {
      title: 'How to Optimize Windows 11 (2024)',
      thumbnail: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80',
    },
  },
];

const quickPrompts = [
  "Why are my laptop fans so loud?",
  'How to fix RAM memory leak?',
  'Check CPU temperature thresholds',
];

const Chat = () => {
  const { activeDevice, experienceLevel, chatInitialQuery, resetChatInitialQuery } = useDashboard();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSafetyBanner, setShowSafetyBanner] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (chatInitialQuery) {
      handleSend(chatInitialQuery);
      resetChatInitialQuery();
    }
  }, [chatInitialQuery]);

  const sendAiResponse = async (messageText) => {
    const payload = {
      message: messageText,
      device: activeDevice.name,
      experienceLevel,
      history: messages.map((m) => ({ role: m.sender, content: m.text })),
    };

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('API server unavailable');
      const data = await response.json();

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Analysis complete. Ensure all power supplies are disconnected before hardware maintenance.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        steps: data.steps,
        hasSafetyWarning: data.hasSafetyWarning,
        recommendedVideo: data.recommendedVideo,
      };
    } catch (error) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Diagnostic report for ${activeDevice.name}: CPU usage is high and the system may be overheating. Check active processes, clear caches, and verify fan airflow.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        steps: [
          'Inspect thermal air intake and clean dust deposits.',
          'Close unnecessary apps and background processes.',
          'Verify fan speed and CPU temperature.',
        ],
        hasSafetyWarning: true,
      };
    }
  };

  const handleSend = async (overrideText) => {
    const text = overrideText || input;
    if (!text.trim() || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const aiMessage = await sendAiResponse(text);
    setMessages((prev) => [...prev, aiMessage]);
    setLoading(false);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <PageTitle>AI Troubleshooting</PageTitle>
        <SubTitle>Ask PC Doctor any hardware or performance question.</SubTitle>

        {showSafetyBanner && (
          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <AntDesign name="exclamationcircle" size={18} color="#92400E" />
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Hardware Safety Warning</Text>
              <Text style={styles.bannerText}>Disconnect power and ground yourself before opening your machine.</Text>
            </View>
            <Pressable onPress={() => setShowSafetyBanner(false)}>
              <Text style={styles.dismiss}>Dismiss</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.messagesContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                {item.sender === 'ai' && <Feather name="cpu" size={18} color={brand} style={{ marginBottom: 10 }} />}
                <Text style={[styles.messageText, item.sender === 'user' ? styles.userText : styles.aiText]}>{item.text}</Text>
                {item.steps?.length > 0 && (
                  <View style={styles.stepList}>
                    {item.steps.map((step, idx) => (
                      <Text key={idx} style={styles.stepText}>{`${idx + 1}. ${step}`}</Text>
                    ))}
                  </View>
                )}
                {item.recommendedVideo && (
                  <View style={styles.videoCard}>
                    <Text style={styles.videoLabel}>Recommended Video</Text>
                    <Text style={styles.videoTitle}>{item.recommendedVideo.title}</Text>
                  </View>
                )}
                {item.hasSafetyWarning && <Text style={styles.safetyTip}>Safety: Stop if you suspect battery damage, smoke, or electrical hazard.</Text>}
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.quickChips}>
          {quickPrompts.map((prompt) => (
            <Pressable key={prompt} style={styles.quickChip} onPress={() => handleSend(prompt)}>
              <Text style={styles.quickChipText}>{prompt}</Text>
            </Pressable>
          ))}
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputArea}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask PC Doctor about your issue..."
            placeholderTextColor={darkLight}
            style={styles.input}
            multiline
          />
          <Pressable style={styles.sendButton} onPress={() => handleSend()}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />}
          </Pressable>
        </KeyboardAvoidingView>
      </InnerContainer>
    </StyledContainer>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bannerIcon: {
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
  dismiss: {
    color: '#92400E',
    fontWeight: '700',
  },
  messagesContainer: {
    flex: 1,
    width: '100%',
    marginBottom: 14,
  },
  messageBubble: {
    marginVertical: 6,
    padding: 14,
    borderRadius: 18,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#EDE9FE',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F8FAFC',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#3730A3',
  },
  aiText: {
    color: '#0F172A',
  },
  stepList: {
    marginTop: 10,
    paddingLeft: 10,
  },
  stepText: {
    color: '#334155',
    fontSize: 13,
    marginBottom: 4,
  },
  videoCard: {
    marginTop: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 12,
  },
  videoLabel: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '700',
    marginBottom: 4,
  },
  videoTitle: {
    fontSize: 13,
    color: '#0F172A',
  },
  safetyTip: {
    marginTop: 10,
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '700',
  },
  quickChips: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  quickChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 10,
  },
  quickChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '700',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },
  sendButton: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Chat;
