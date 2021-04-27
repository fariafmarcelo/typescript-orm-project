import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import {Photo} from "./entity/Photo"
import {PhotoMetadata} from "./entity/PhotoMetaData"

createConnection().then(async connection => {

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Marcelo";
    user.lastName = "Faria";
    user.age = 21;

    // insere no BD
    let userRepository = connection.getRepository(User);
    await userRepository.save(user);
    console.log("Saved a new user with id: " + user.id);

    let photo = new Photo();
    photo.name = "Me and Bears";
    photo.description = "I am near polar bears";
    photo.filename = "photo-with-bears.jpg";
    photo.views = 1;
    photo.isPublished = true;

    // create a photo metadata
    let metadata = new PhotoMetadata();
    metadata.height = 640;
    metadata.width = 480;
    metadata.compressed = true;
    metadata.comment = "cybershoot";
    metadata.orientation = "portrait";
    metadata.photo = photo; // this way we connect them

    // insere no BD
    let photoRepository = connection.getRepository(Photo);
    await photoRepository.save(photo);
    console.log("Saved a new photo with id: " + photo.id);

    // Carregando os usuários do banco
    console.log("Loading users from the database...");
    const users = await userRepository.find();
    console.log("Loaded users: ", users);

    let metadataRepository = connection.getRepository(PhotoMetadata);
    await metadataRepository.save(metadata);

    let photos = await connection
        .getRepository(Photo)
        .createQueryBuilder("photo")
        .innerJoinAndSelect("photo.metadata", "metadata")
        .getMany();

    console.log(photos)

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));