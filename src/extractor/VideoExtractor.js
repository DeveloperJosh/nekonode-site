/// videoExtractor.js
import axios from 'axios';

class VideoExtractor {
  constructor() {
    this.client = axios.create();
  }

  async extract(videoUrl) {
    throw new Error('Method "extract" should be implemented in subclasses');
  }
}

export default VideoExtractor;