export interface Anime365Response<T> {
  data: T;
}















export interface Embed {
  download: DownloadItem[];
  embedUrl: string;
  stream: StreamItem[];
  subtitlesUrl: string | null;
}



export interface DownloadItem {
  height: number;
  url: string;
}



export interface StreamItem {
  height: number;
  urls: string[];
}
