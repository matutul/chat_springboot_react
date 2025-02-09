package com.ashraf.chat.payload;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageRequest {
    private String sender;
    private String content;
    private String roomId;
}
