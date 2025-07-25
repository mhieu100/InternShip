package com.mhieu.camera_service_v2.config;

import java.util.concurrent.ConcurrentHashMap;

public class CameraStreamManager {
    private static final ConcurrentHashMap<String, CameraStream> streams = new ConcurrentHashMap<>();

    public static CameraStream getOrCreateStream(String cameraId, String rtspUrl) throws Exception {
        return streams.computeIfAbsent(cameraId, id -> {
            CameraStream stream = new CameraStream(Long.parseLong(rtspUrl), rtspUrl);
            try {
                stream.start();
            } catch (Exception e) {
                e.printStackTrace();
            }
            return stream;
        });
    }

    public static void removeClient(String cameraId, StreamWebSocketHandler.ClientSession client) {
        CameraStream stream = streams.get(cameraId);
        if (stream != null) {
            stream.removeClient(client);
        }
    }
}

