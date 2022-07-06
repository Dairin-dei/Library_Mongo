export interface IUser {
  _id?: string;
  username: string;
}

export interface ICountry {
  _id?: string;
  name: string;
}

export interface IGenre {
  _id?: string;
  name: string;
}

export interface ILanguage {
  _id?: string;
  name: string;
}

export interface IAuthor {
  _id?: string;
  name: string;
  fullName: string;
  originalName: string;
  country: ICountry;
}

export interface iBook {
  _id?: string;
  name: string;
  originalName: string;
  authorMainId: IAuthor;
  authorsIds: IAuthor[];
  genreMainId: IGenre;
  genresIds: IGenre[];
  year: number;
  volumeId: IVolume;
}

export interface IVolume {
  _id?: string;
  name: string;
  year: number;
  cabinet: number;
  shelf: number;
  picture: string;
}
