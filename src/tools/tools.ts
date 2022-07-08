import { IAuthor, IGenre, ILanguage, IVolume } from '../interfaces';

export function convertArrayToArrayIds(
  arrayObjects: IGenre[] | ILanguage[] | IVolume[] | IAuthor[]
): string[] {
  return arrayObjects.length ? arrayObjects.map((item) => item._id) : [];
}

export function addNewItemIntoArrayIDs(arrayOfIds: string[], id: string) {
  if (arrayOfIds.findIndex((item) => item === id) < 0) {
    return [...arrayOfIds, ...id];
  }
  return arrayOfIds;
}
