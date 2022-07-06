export interface IUser {
  username: string;
}

export interface ICountry {
  name: string;
}

export interface IGenre {
  name: string;
}

export interface ILanguage {
  name: string;
}

export interface IAuthor {
  name: string;
  fullName: string;
  originalName: string;
  country: ICountry;
}

export interface iBook {
  name: string;
  originalName: string;
  authorMain: IAuthor;
  authors: IAuthor[];
  genreMain: IGenre;
  genres: IGenre[];
  year: number;
  volume: IVolume;
}

export interface IVolume {
  name: string;
  year: number;
  cabinet: number;
  shelf: number;
  picture: string;
}
