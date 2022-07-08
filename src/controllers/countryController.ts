import { IncomingMessage, ServerResponse } from 'http';
import { ICountry } from '../interfaces';
import {
  createCountryDb,
  findAllCountriesDb,
  findCountryByIdDb,
  findCountryByNameDb,
  removeCountryDb,
  updateCountryDb,
} from '../models/countryModel';

export async function findAllCountries(
  request: IncomingMessage,
  response: ServerResponse
) {
  try {
    const countriesInDatabase = await findAllCountriesDb();
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(countriesInDatabase));
  } catch (error) {
    console.log("Sorry, can't get countries", error.message);
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify([]));
  }
}

export async function findCountry(
  request: IncomingMessage,
  response: ServerResponse
) {
  const countryId = request.url?.split('/')[1] || '0';
  const country = await findCountryByIdDb(countryId);

  if (country) {
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(country));
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({ message: `I don't know country with id ${countryId}` })
    );
  }
}

export async function createNewCountry(
  request: IncomingMessage,
  response: ServerResponse
) {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });
  console.log(body);
  request.on('end', async () => {
    try {
      const { name } = JSON.parse(body);

      if (name === undefined || name.trim() === '') {
        response.writeHead(400, { 'content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            message:
              "Hello. I'm sorry, but I couldn't add new country. You should fill name",
          })
        );
      } else {
        const newCountry = await createCountryDb(name);
        response.writeHead(201, { 'content-Type': 'application/json' });
        response.end(JSON.stringify(newCountry));
      }
    } catch (error) {
      response.writeHead(400, { 'content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          message:
            "Hello. I'm sorry, but I couldn't add new country. There's a mistake in data",
        })
      );
    }
  });
}

export async function findOrCreateCountryByName(
  name: string
): Promise<ICountry> {
  const country: ICountry | null = await findCountryByNameDb(name);
  if (country) {
    return country;
  }
  const newCountry: ICountry = await createCountryDb(name);
  return newCountry;
}

export async function updateCountry(
  request: IncomingMessage,
  response: ServerResponse
) {
  const countryId = request.url?.split('/')[1] || '0';
  const country = await findCountryByIdDb(countryId);
  if (country) {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    request.on('end', async () => {
      try {
        const { countryName } = JSON.parse(body);
        if (countryName === undefined || countryName.trim() === '') {
          response.writeHead(400, { 'content-Type': 'application/json' });
          response.end(
            JSON.stringify({
              message:
                "Hello. I'm sorry, but I couldn't update this country. You should send non-empty name",
            })
          );
        } else {
          const updatedCountry = await updateCountryDb(countryId, countryName);
          response.writeHead(200, { 'content-Type': 'application/json' });
          response.end(JSON.stringify(updatedCountry));
        }
      } catch {
        response.writeHead(500, { 'content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            message: `Hello. You quite possibly have mistakes in sent data. Please check`,
          })
        );
      }
    });
  }
}

export async function deleteCountry(
  request: IncomingMessage,
  response: ServerResponse
) {
  const countryId = request.url?.split('/')[1] || '0';
  const country = await findCountryByIdDb(countryId);

  if (country) {
    removeCountryDb(countryId);
    response.writeHead(204, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Hello. country with id ${countryId} was deleted`,
      })
    );
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Hello. I'm sorry, but I can't find country with id ${countryId}`,
      })
    );
  }
}
