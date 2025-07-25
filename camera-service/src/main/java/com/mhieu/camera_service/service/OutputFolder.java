package com.mhieu.camera_service.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;

import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;

import com.mhieu.camera_service.exception.AppException;
import com.mhieu.camera_service.exception.ErrorCode;

import jakarta.annotation.PostConstruct;

@Service
public class OutputFolder {

    private static final String VIDEO_DIR = "/home/mhieu/Coding/GitHub/exercise/camera-service/videos";

    @PostConstruct
    public void init() {
        try {
            createDirectoryWithPermissions(VIDEO_DIR);
            cleanAllStreams();
            System.out.println("[Init] Stream service ready");
        } catch (IOException e) {
            System.out.println("[Init Error] " + e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_ERROR);
        }
    }

    public void createDirectoryWithPermissions(String path) throws IOException {
        File dir = new File(path);
        if (!dir.exists() && !dir.mkdirs()) {
            throw new IOException("Failed to create: " + path);
        }
        if (!dir.canWrite() && !dir.setWritable(true, false)) {
            throw new IOException("Failed to set write permissions: " + path);
        }
    }

    public void cleanAllStreams() {
        try {
            File videoDir = new File(VIDEO_DIR);
            File[] cameraDirs = videoDir.listFiles(File::isDirectory);
            if (cameraDirs != null) {
                for (File dir : cameraDirs) {
                    FileSystemUtils.deleteRecursively(dir);
                }
            }
            System.out.println("[Clean] All streams cleaned");
        } catch (Exception e) {
            System.out.println("[Clean Error] " + e.getMessage());
        }
    }

    public String getCameraDirectory(Long cameraId) {
        return VIDEO_DIR + "/" + cameraId;
    }

    public void createOutputDirectory(Long cameraId) throws IOException {
        String cameraDir = getCameraDirectory(cameraId);
        createDirectoryWithPermissions(cameraDir);
        cleanupAllSegments(cameraId);
        System.out.println("[Dir] Created: " + cameraDir);
    }

    public void cleanupAllSegments(Long cameraId) {
        String cameraDir = getCameraDirectory(cameraId);
        try {
            File cameraDirFile = new File(cameraDir);
            if (cameraDirFile.exists()) {
                FileSystemUtils.deleteRecursively(cameraDirFile);
                if (!cameraDirFile.mkdirs()) {
                    throw new IOException("Failed to recreate: " + cameraDir);
                }
            }
            System.out.println("[Clean-" + cameraId + "] Segments cleaned");
        } catch (IOException e) {
            System.out.println("[Clean-" + cameraId + " Error] " + e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_ERROR);
        }
    }

    public void cleanOldSegments(Long cameraId) {
        try {
            Path directory = Paths.get(VIDEO_DIR, cameraId.toString());
            if (!Files.exists(directory))
                return;

            try (DirectoryStream<Path> stream = Files.newDirectoryStream(directory, "*.ts")) {
                for (Path file : stream) {
                    try {
                        BasicFileAttributes attrs = Files.readAttributes(file, BasicFileAttributes.class);
                        if (System.currentTimeMillis() - attrs.creationTime().toMillis() > 60000) {
                            Files.deleteIfExists(file);
                        }
                    } catch (IOException e) {
                        System.out.println("[Clean-" + cameraId + " Error] " + e.getMessage());
                    }
                }
            }
        } catch (IOException e) {
            System.out.println("[Clean-" + cameraId + " Error] " + e.getMessage());
        }
    }
}
