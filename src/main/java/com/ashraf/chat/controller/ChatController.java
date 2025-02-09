package com.ashraf.chat.controller;

import com.ashraf.chat.entities.Message;
import com.ashraf.chat.entities.Room;
import com.ashraf.chat.payload.MessageRequest;
import com.ashraf.chat.repositories.RoomRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@Controller
public class ChatController {
    private final RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(@DestinationVariable String roomId, @RequestBody MessageRequest requestMessage) {
        Room room = roomRepository.findByRoomId(requestMessage.getRoomId());

            Message message = new Message();
            message.setSender(requestMessage.getSender());
            message.setContent(requestMessage.getContent());
            message.setTimeStamp(LocalDateTime.now());
        if(room != null) {
            room.getMessages().add(message);
            roomRepository.save(room);
        }else {
            throw new RuntimeException("Room not found");
        }
        return message;
    }
}
