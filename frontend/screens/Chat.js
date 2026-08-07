import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useDashboard } from '../context/DashboardContext';
import { Colors, StyledContainer, InnerContainer, PageTitle, SubTitle } from '../components/style';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../api/apiService';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const { brand, darkLight, tertiary } = Colors;

const quickPrompts = [
  "Why are my laptop fans so loud?",
  'How to fix RAM memory leak?',
  'Check CPU temperature thresholds',
];

const Chat = () => {
  const { activeDevice, experienceLevel, chatInitialQuery, resetChatInitialQuery } = useDashboard();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [showSafetyBanner, setShowSafetyBanner] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (chatInitialQuery) {
      handleSend(chatInitialQuery);
      resetChatInitialQuery();
    }
  }, [chatInitialQuery]);

  const sendAiResponse = async (messageText) => {
    try {
      const response = await api.sendMessage(messageText, sessionId);

      // Update session ID if new session was created
      if (response.session_id && !sessionId) {
        setSessionId(response.session_id);
      }

      // Check for high-risk safety warning
      if (response.is_high_risk && response.warning_data) {
        setShowSafetyBanner(true);
      }

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.response_text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isHighRisk: response.is_high_risk,
        warningData: response.warning_data,
      };
    } catch (err) {
      setError(err.message || 'Failed to get AI response');
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `I apologize, but I'm having trouble connecting to the server right now. Please check your connection and try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
    }
  };

  const handleSend = async (overrideText) => {
    const text = overrideText || input;
    if (!text.trim() || loading) return;

    setError(null);

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

  // Show device context banner
  const deviceContext = activeDevice
    ? `Troubleshooting: ${activeDevice.name}`
    : 'No device registered';

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <PageTitle>AI Troubleshooting</PageTitle>
        <SubTitle>Ask PC Doctor any hardware or performance question.</SubTitle>

        {/* Device Context Banner */}
        {activeDevice && (
          <View style={styles.deviceBanner}>
            <Feather name="laptop" size={16} color={brand} style={{ marginRight: 8 }} />
            <Text style={styles.deviceText}>{deviceContext}</Text>
          </View>
        )}

        {/* Safety Warning Banner (dynamic from backend) */}
        {showSafetyBanner && messages.some(m => m.isHighRisk) && (
          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <AntDesign name="exclamationcircle" size={18} color="tertiary" />
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>⚠️ Safety Warning Active</Text>
              <Text style={styles.bannerText}>The AI has detected a high-risk issue. Please follow safety instructions carefully.</Text>
            </View>
            <Pressable onPress={() => setShowSafetyBanner(false)}>
              <Text style={styles.dismiss}>Dismiss</Text>
            </Pressable>
          </View>
        )}

        {/* Default Safety Banner */}
        {showSafetyBanner && !messages.some(m => m.isHighRisk) && (
          <View style={styles.defaultBanner}>
            <View style={styles.bannerIcon}>
              <AntDesign name="exclamationcircle" size={18} color="tertiary" />
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

        {/* Error State */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Messages */}
        <View style={styles.messagesContainer}>
          {messages.length === 0 && !loading ? (
            <View style={styles.emptyChat}>
              <Feather name="message-circle" size={48} color={darkLight} />
              <Text style={styles.emptyChatText}>Start a conversation with PC Doctor AI</Text>
              <Text style={styles.emptyChatSubtext}>
                {activeDevice
                  ? `I'll help you troubleshoot your ${activeDevice.name}`
                  : 'Ask me about any laptop issue'}
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                  {item.sender === 'ai' && <Feather name="cpu" size={18} color={brand} style={{ marginBottom: 10 }} />}
                  <Text style={[styles.messageText, item.sender === 'user' ? styles.userText : styles.aiText]}>{item.text}</Text>

                  {/* High Risk Warning */}
                  {item.isHighRisk && item.warningData && (
                    <View style={styles.warningCard}>
                      <Text style={styles.warningTitle}>🚨 {item.warningData.warning_title || 'High Risk Detected'}</Text>
                      {item.warningData.action_recommendation && (
                        <Text style={styles.warningText}>{item.warningData.action_recommendation}</Text>
                      )}
                    </View>
                  )}

                  {/* Safety Tip */}
                  {item.isHighRisk && (
                    <Text style={styles.safetyTip}>Safety: Stop if you suspect battery damage, smoke, or electrical hazard.</Text>
                  )}
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Quick Prompts */}
        <View style={styles.quickChips}>
          {quickPrompts.map((prompt) => (
            <Pressable key={prompt} style={styles.quickChip} onPress={() => handleSend(prompt)}>
              <Text style={styles.quickChipText}>{prompt}</Text>
            </Pressable>
          ))}
        </View>

        {/* Input Area */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputArea}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask PC Doctor about your issue..."
            placeholderTextColor={darkLight}
            style={styles.input}
            multiline
          />
          <Pressable style={styles.sendButton} onPress={() => handleSend()} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />}
          </Pressable>
        </KeyboardAvoidingView>
      </InnerContainer>
    </StyledContainer>
  );
};

const styles = StyleSheet.create({
  deviceBanner: {
    backgroundColor: secondary,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: border,
  },
  deviceText: {
    fontSize: 12,
    color: tertiary,
    fontWeight: '700',
  },
  banner: {
    backgroundColor: Colors.warning + '33',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.warning,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  defaultBanner: {
    backgroundColor: Colors.warning + '33',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.warning,
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
    color: tertiary,
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 12,
    color: tertiary,
    lineHeight: 18,
  },
  dismiss: {
    color: tertiary,
    fontWeight: '700',
  },
  errorBanner: {
    backgroundColor: Colors.warning + '33',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  errorText: {
    fontSize: 12,
    color: tertiary,
  },
  messagesContainer: {
    flex: 1,
    width: '100%',
    marginBottom: 14,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyChatText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'tertiary',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyChatSubtext: {
    fontSize: 13,
    color: darkLight,
    textAlign: 'center',
  },
  messageBubble: {
    marginVertical: 6,
    padding: 14,
    borderRadius: 18,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: 'secondary',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'secondary',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: brand,
  },
  aiText: {
    color: tertiary,
  },
  warningCard: {
    marginTop: 12,
    backgroundColor: Colors.warning + '33',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: 'tertiary',
    marginBottom: 6,
  },
  warningText: {
    fontSize: 12,
    color: 'tertiary',
    lineHeight: 18,
  },
  safetyTip: {
    marginTop: 10,
    fontSize: 12,
    color: 'tertiary',
    fontWeight: '700',
  },
  quickChips: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  quickChip: {
    backgroundColor: 'secondary',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 10,
  },
  quickChipText: {
    fontSize: 11,
    color: 'tertiary',
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
    borderColor: 'border',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: 'tertiary',
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