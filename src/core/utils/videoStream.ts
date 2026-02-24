import { Quality } from "@prisma/client";
import ffmpeg from "fluent-ffmpeg"


export function detectionQuality(filepath: string): Promise<Quality> {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filepath, (err, metadata) => {
            if (err) return reject(err)

            const videoStream = metadata.streams.find(s => s.codec_type === "video")
            const height = videoStream?.height ?? 0

            if (height >= 2160) resolve(Quality.Q4K)
            else if (height >= 1080) resolve(Quality.Q1080p)
            else if (height >= 720) resolve(Quality.Q720p);
            else if (height >= 480) resolve(Quality.Q480p);
            else if (height >= 360) resolve(Quality.Q360p);
            else resolve(Quality.Q240p)
        })
    })
}