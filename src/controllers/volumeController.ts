import { IncomingMessage, ServerResponse } from 'http';
import { IVolume } from '../tools/interfaces';
import {
  createVolumeDb,
  findAllVolumesDb,
  findVolumeByIdDb,
  findVolumeByNameDb,
  removeVolumeDb,
  updateVolumeDb,
} from '../models/volumeModel';

export async function findAllVolumes(
  request: IncomingMessage,
  response: ServerResponse
) {
  try {
    const volumesInDatabase = await findAllVolumesDb();
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(volumesInDatabase));
  } catch (error) {
    console.log("Sorry, can't get volumes", error.message);
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify([]));
  }
}

export async function findVolume(
  request: IncomingMessage,
  response: ServerResponse
) {
  const volumeId = request.url?.split('/')[1] || '0';
  const volume = await findVolumeByIdDb(volumeId);

  if (volume) {
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(volume));
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({ message: `I don't know volume with id ${volumeId}` })
    );
  }
}

export async function createNewVolume(
  request: IncomingMessage,
  response: ServerResponse
) {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });

  request.on('end', async () => {
    try {
      const { name, cabinet, shelf, picture, year } = JSON.parse(body);

      const newVolume = await createVolumeDb(
        name,
        cabinet,
        shelf,
        picture,
        year
      );
      response.writeHead(201, { 'content-Type': 'application/json' });
      response.end(JSON.stringify(newVolume));
    } catch (error) {
      response.writeHead(400, { 'content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          message:
            "Hello. I'm sorry, but I couldn't add new volume. You should fill name",
        })
      );
    }
  });
}

export async function findOrCreateVolumeByName(name: string): Promise<IVolume> {
  const volume: IVolume = await findVolumeByNameDb(name);
  if (volume) {
    return volume;
  }
  const newVolume: IVolume = await createVolumeDb(name);
  return newVolume;
}

export async function updateVolume(
  request: IncomingMessage,
  response: ServerResponse
) {
  const volumeId = request.url?.split('/')[1] || '0';
  const volume = await findVolumeByIdDb(volumeId);
  if (volume) {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    request.on('end', async () => {
      try {
        const { name, cabinet, shelf, picture, year } = JSON.parse(body);
        const updatedVolume = await updateVolumeDb(
          volumeId,
          name,
          cabinet,
          shelf,
          picture,
          year
        );
        response.writeHead(200, { 'content-Type': 'application/json' });
        response.end(JSON.stringify(updatedVolume));
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

export async function deleteVolume(
  request: IncomingMessage,
  response: ServerResponse
) {
  const volumeId = request.url?.split('/')[1] || '0';
  const volume = await findVolumeByIdDb(volumeId);

  if (volume) {
    removeVolumeDb(volumeId);
    response.writeHead(204, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Hello. volume with id ${volumeId} was deleted`,
      })
    );
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Hello. I'm sorry, but I can't find volume with id ${volumeId}`,
      })
    );
  }
}
