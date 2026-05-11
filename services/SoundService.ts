import { Audio } from 'expo-av';

class SoundService {
  private static instance: SoundService;
  private sound: Audio.Sound | null = null;
  private isLoaded = false;

  private constructor() {}

  static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  async loadSound(): Promise<void> {
    if (this.isLoaded && this.sound) {
      return;
    }

    try {
      // Set audio mode for better compatibility
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        require('../assets/click.mp3')
      );
      
      // Unload previous sound if exists
      if (this.sound) {
        await this.sound.unloadAsync();
      }
      
      this.sound = sound;
      this.isLoaded = true;
      console.log('SoundService: Sound loaded successfully');
    } catch (error) {
      console.log('SoundService: Error loading sound:', error);
      this.isLoaded = false;
    }
  }

  async playClickSound(): Promise<void> {
    try {
      if (!this.isLoaded || !this.sound) {
        console.log('SoundService: Sound not loaded, attempting to load...');
        await this.loadSound();
      }

      if (this.sound && this.isLoaded) {
        await this.sound.replayAsync();
        console.log('SoundService: Sound played successfully');
      } else {
        console.log('SoundService: Still unable to play sound');
      }
    } catch (error) {
      console.log('SoundService: Error playing sound:', error);
      // Try to reload if there's an error
      this.isLoaded = false;
      await this.loadSound();
    }
  }

  async unload(): Promise<void> {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
      this.isLoaded = false;
    }
  }
}

export default SoundService;
