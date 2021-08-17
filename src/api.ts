import data from "./data";

export interface Person {
  key: string;
  firstname: string;
  lastname: string;
  age: number;
  address: string;
}

export const getPeopleList = (): Promise<Person[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 200);
  });
};
