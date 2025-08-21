package com.dev.chatbot_service.service;

import com.dev.chatbot_service.dto.request.ChatRequest;
import com.dev.chatbot_service.dto.response.VaccineItem;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.content.Media;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

@Service

public class ChatService {
    private final ChatClient chatClient;

    public ChatService(ChatClient.Builder builder) {
        chatClient = builder.build();
    }

    public String generate(ChatRequest request) {
        SystemMessage systemMessage = new SystemMessage("""
                You are SafeVax AI of SafeVax System ( Vaccine information and advice )
                """);

        UserMessage userMessage = new UserMessage(request.prompt());

        Prompt prompt = new Prompt(systemMessage, userMessage);
        return chatClient.prompt(prompt).call().content();
    }

    public VaccineItem dataInfo(ChatRequest request) {
        SystemMessage systemMessage = new SystemMessage("""
                You are SafeVax AI of SafeVax System ( Vaccine information and advice )
                """);

        UserMessage userMessage = new UserMessage(request.prompt());

        Prompt prompt = new Prompt(systemMessage, userMessage);
        return chatClient.prompt(prompt).call().entity(VaccineItem.class);
    }

    public List<VaccineItem> getMockData(ChatRequest request) {
        SystemMessage systemMessage = new SystemMessage("""
                You are SafeVax AI of SafeVax System ( Vaccine information and advice )
                """);

        UserMessage userMessage = new UserMessage(request.prompt());

        Prompt prompt = new Prompt(systemMessage, userMessage);
        return chatClient.prompt(prompt).call().entity(new ParameterizedTypeReference<List<VaccineItem>>() {
        });
    }

    public String chatWithImage(MultipartFile file, String message) {
        Media media = Media.builder()
                .mimeType(MimeTypeUtils.parseMimeType(Objects.requireNonNull(file.getContentType())))
                .data(file.getResource())
                .build();

        ChatOptions chatOptions = ChatOptions.builder()
                .temperature(0D)
                .build();

        return chatClient.prompt()
                .options(chatOptions)
                .system("You are SafeVax AI")
                .user(promptUserSpec
                        -> promptUserSpec.media(media)
                        .text(message))
                .call()
                .content();
    }
}
