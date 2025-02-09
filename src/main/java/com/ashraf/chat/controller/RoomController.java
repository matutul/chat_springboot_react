package com.ashraf.chat.controller;

import com.ashraf.chat.entities.Message;
import com.ashraf.chat.entities.Room;
import com.ashraf.chat.repositories.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin(origins = "*")
public class RoomController {
    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    //    create room with room id
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId) {
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong!");
        Room room = roomRepository.findByRoomId(roomId);
        if(room != null) {
            return ResponseEntity.badRequest().body("Room already exists");
        }
        Room newRoom = new Room();
        newRoom.setRoomId(roomId);
        Room savedRoom = roomRepository.save(newRoom);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }
    //    get room with room id
    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable String roomId) {
        Room room = roomRepository.findByRoomId(roomId);
        if(room == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(room);
    }

    //    get messages of a room with room id
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getRoomMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "1", required = false) int page,
            @RequestParam(value = "size", defaultValue = "20", required = false) int size
    ) {
        Room room = roomRepository.findByRoomId(roomId);
        if(room == null) {
            return ResponseEntity.notFound().build();
        }
        List<Message> roomMessages = room.getMessages();
        int start = (page - 1) * size;
        int end = start + size;
        if(end > roomMessages.size()) {
            end = roomMessages.size();
        }
        List<Message> paginatedMessages = roomMessages.subList(start, end);
        return ResponseEntity.ok(paginatedMessages);
    }
}

