import thegamesDbApi from ".";

describe("ThegamesDb API", () => {
  describe("Search games", () => {
    it("Should succeed on matching query", () => {
      const query = "Zelda";

      return thegamesDbApi.searchGame(query).then(({ data: { games } }) => {
        expect(games).toBeDefined();
        expect(games instanceof Array).toBeTruthy();
        expect(games.length).toBeGreaterThan(0);

        games.forEach(({ game_title }) =>
          expect(game_title.toLowerCase()).toContain(query.toLowerCase())
        );
      });
    });

    it("Should succeed on matching query and include extra data information", () => {
      const query = "Zelda";
      const params = "boxart,platform";

      return thegamesDbApi
        .searchGame(query, params)
        .then(({ data: { games }, include: { boxart, platform } }) => {
          expect(games).toBeDefined();
          expect(games instanceof Array).toBeTruthy();
          expect(games.length).toBeGreaterThan(0);
          games.forEach(({ game_title }) =>
            expect(game_title.toLowerCase()).toContain(query.toLowerCase())
          );

          expect(boxart).toBeDefined();

          expect(platform).toBeDefined();
        });
    });

    it("Should fail on empty query", () => {
      const query = "";
      expect(() => thegamesDbApi.searchGame(query)).toThrowError(
        "query is empty"
      );
    });

    it("Should fail if query is not a string", () => {
      const query = 123;
      expect(() => thegamesDbApi.searchGame(query)).toThrowError(
        `${query} is not a string`
      );
    });

    it("Should fail on empty query", () => {
      const query = "";
      expect(() => thegamesDbApi.searchGame(query)).toThrowError(
        "query is empty"
      );
    });
  });

  const apiKey =
    "ec70893446ed73812756c3fc599bb3da6c263807fb2500265d4b675a6855aab8";

  describe("ultra-vgsm api retrieve GAME DATA by GameID", () => {
    beforeEach(() => {
      thegamesDbApi.apiKey = apiKey;
      thegamesDbApi.proxy = "https://skylabcoders.herokuapp.com/proxy?url=";
    });

    describe("sync fails", () => {
      it("should throw error on number gameId", () => {
        const gameId = 23;

        expect(typeof gameId).toBe("number");
        expect(() => thegamesDbApi.retrieveGame(gameId)).toThrowError(
          `${gameId} is not a string`
        );
      });

      it("should throw error on array gameId", () => {
        const gameId = [1, 2, 3];

        expect(gameId.constructor).toBe(Array);
        expect(() => thegamesDbApi.retrieveGame(gameId)).toThrowError(
          `${gameId} is not a string`
        );
      });

      it("should throw error on object gameId", () => {
        const gameId = { hello: "world" };

        expect(gameId.constructor).toBe(Object);
        expect(() => thegamesDbApi.retrieveGame(gameId)).toThrowError(
          `${gameId} is not a string`
        );
      });

      it("should throw error on boolean gameId", () => {
        const gameId = false;

        expect(typeof gameId).toBe("boolean");
        expect(() => thegamesDbApi.retrieveGame(gameId)).toThrowError(
          `${gameId} is not a string`
        );
      });

      it("should throw error on function gameId", () => {
        const gameId = () => console.log("hello");

        expect(typeof gameId).toBe("function");
        expect(() => thegamesDbApi.retrieveGame(gameId)).toThrowError(
          `${gameId} is not a string`
        );
      });

      it("should throw error on empty gameId", () => {
        const gameId = "";

        expect(() => thegamesDbApi.retrieveGame(gameId)).toThrowError(
          "gameId is empty"
        );
      });

      it("should throw error when gameId is not a string number (isNaN(Number(gameId)))", () => {
        const gameId = "a";

        expect(() => thegamesDbApi.retrieveGame(gameId)).toThrowError(
          `${gameId} should be a number`
        );
      });

      it("should throw error when gameId is <1", () => {
        const gameId = "0";

        expect(() => thegamesDbApi.retrieveGame(gameId)).toThrowError(
          `${gameId} should be a bigger than 0 number`
        );
      });

      it("should throw error when gameId is a float number", () => {
        const gameId = "1.23";

        expect(() => thegamesDbApi.retrieveGame(gameId)).toThrowError(
          `${gameId} should be an integer number`
        );
      });
    });

    describe("async fails", () => {
      it("should throw error when gameId doesn't exists on database", () => {
        const gameId = "9823749872394872983";

        return thegamesDbApi
          .retrieveGame(gameId)
          .then(() => {
            throw Error("should not pass by here");
          })
          .catch(({ message }) =>
            expect(message).toBe(`${gameId} doesn't exist in database`)
          );
      });
      it("should fail on server down", () => {
        const gameId = "1";
        thegamesDbApi.proxy = "https://skylabcoders.hulioapp.com/proxy?url=";

        return thegamesDbApi
          .retrieveGame(gameId)
          .then(() => {
            throw Error("should not pass by here");
          })
          .catch(({ message }) =>
            expect(message).toBe(`Network request failed`)
          );
      });
      it("should fail on non valid API key", () => {
        const gameId = "1";
        thegamesDbApi.apiKey = "HULIO";

        return thegamesDbApi
          .retrieveGame(gameId)
          .then(() => {
            throw Error("should not pass by here");
          })
          .catch(({ message }) =>
            expect(message).toBe(
              `This route requires and API key and no API key was provided.`
            )
          );
      });
    });

    describe("success situation", () => {
      it("should succeed on retrieve correct game info", () => {
        const gameId = "1";
        const gameTitle = "Halo: Combat Evolved";

        return thegamesDbApi.retrieveGame(gameId).then(gameData => {
          expect(gameData).toBeDefined();
          expect(gameData.include.platform.data[`${gameId}`].name).toBe("PC");
          expect(gameData.data.games[0].game_title).toBe(gameTitle);
        });
      });
    });
  });

  describe("ultra-vgsm api retrieve IMAGES by GameID", () => {
    beforeEach(() => {
      thegamesDbApi.apiKey = apiKey;
      thegamesDbApi.proxy = "https://skylabcoders.herokuapp.com/proxy?url=";
    });

    describe("sync fails", () => {
      it("should throw error on number gameId", () => {
        const gameId = 23;

        expect(typeof gameId).toBe("number");
        expect(() => thegamesDbApi.retrieveImages(gameId)).toThrowError(
          `${gameId} is not a string`
        );
      });

      it("should throw error on array gameId", () => {
        const gameId = [1, 2, 3];

        expect(gameId.constructor).toBe(Array);
        expect(() => thegamesDbApi.retrieveImages(gameId)).toThrowError(
          `${gameId} is not a string`
        );
      });

      it("should throw error on object gameId", () => {
        const gameId = { hello: "world" };

        expect(gameId.constructor).toBe(Object);
        expect(() => thegamesDbApi.retrieveImages(gameId)).toThrowError(
          `${gameId} is not a string`
        );
      });

      it("should throw error on boolean gameId", () => {
        const gameId = false;

        expect(typeof gameId).toBe("boolean");
        expect(() => thegamesDbApi.retrieveImages(gameId)).toThrowError(
          `${gameId} is not a string`
        );
      });

      it("should throw error on function gameId", () => {
        const gameId = () => console.log("hello");

        expect(typeof gameId).toBe("function");
        expect(() => thegamesDbApi.retrieveImages(gameId)).toThrowError(
          `${gameId} is not a string`
        );
      });

      it("should throw error on empty gameId", () => {
        const gameId = "";

        expect(() => thegamesDbApi.retrieveImages(gameId)).toThrowError(
          "gameId is empty"
        );
      });

      it("should throw error when gameId is not a string number (isNaN(Number(gameId)))", () => {
        const gameId = "a";

        expect(() => thegamesDbApi.retrieveImages(gameId)).toThrowError(
          `${gameId} should be a number`
        );
      });

      it("should throw error when gameId is <0", () => {
        const gameId = "0";

        expect(() => thegamesDbApi.retrieveImages(gameId)).toThrowError(
          `${gameId} should be a bigger than 0 number`
        );
      });

      it("should throw error when gameId is a float number", () => {
        const gameId = "1.23";

        expect(() => thegamesDbApi.retrieveImages(gameId)).toThrowError(
          `${gameId} should be an integer number`
        );
      });
    });

    describe("async fails", () => {
      it("should throw error when gameId doesn't exists on database", () => {
        const gameId = "9823749872394872983";

        return thegamesDbApi
          .retrieveImages(gameId)
          .then(() => {
            throw Error("should not pass by here");
          })
          .catch(({ message }) =>
            expect(message).toBe(`${gameId} doesn't exist in database`)
          );
      });
      it("should fail on server down", () => {
        const gameId = "1";
        thegamesDbApi.proxy = "https://skylabcoders.hulioapp.com/proxy?url=";

        return thegamesDbApi
          .retrieveImages(gameId)
          .then(() => {
            throw Error("should not pass by here");
          })
          .catch(({ message }) =>
            expect(message).toBe(`Network request failed`)
          );
      });
      it("should fail on non valid API key", () => {
        const gameId = "1";
        thegamesDbApi.apiKey = "HULIO";

        return thegamesDbApi
          .retrieveImages(gameId)
          .then(() => {
            throw Error("should not pass by here");
          })
          .catch(({ message }) =>
            expect(message).toBe(
              `This route requires and API key and no API key was provided.`
            )
          );
      });
    });

    describe("success situation", () => {
      it("should succeed on retrieve correct game images", () => {
        const gameId = "1";

        return thegamesDbApi.retrieveImages(gameId).then(imagesData => {
          expect(imagesData).toBeDefined();
          expect(imagesData.data.base_url.original).toBeDefined();
          expect(imagesData.data.images[`${gameId}`][0].filename).toBeDefined();
          expect(imagesData.data.images[`${gameId}`][0].resolution).toBe(
            "1920x1080"
          );
        });
      });
    });
  });

  describe("Search games by platform", () => {
    it("Search games by platform", () => {
      const id = "1";

      return thegamesDbApi
        .retrieveGamesByPlatform(id)
        .then(({ data: { games } }) => {
          expect(games).toBeDefined();
          expect(games instanceof Array).toBeTruthy();
          expect(games.length).toBeGreaterThan(0);

          games.forEach(({ id }) => expect(id).toEqual(id));
        });
    });

    it("Should fail on empty Id", () => {
      const id = "";
      expect(() => thegamesDbApi.retrieveGamesByPlatform(id)).toThrowError(
        "Id is empty"
      );
    });

    it("should throw error when Id is not a string number (isNaN(Number(Id)))", () => {
      const id = "a";

      expect(() => thegamesDbApi.retrieveGamesByPlatform(id)).toThrowError(
        `${id} should be a number`
      );
    });

    it("should throw error when Id is <1", () => {
      const id = "0";

      expect(() => thegamesDbApi.retrieveGamesByPlatform(id)).toThrowError(
        `${id} should be a bigger than 0`
      );
    });

    it("should throw error on array Id", () => {
      const id = [1, 2, 3];

      expect(id.constructor).toBe(Array);
      expect(() => thegamesDbApi.retrieveGamesByPlatform(id)).toThrowError(
        `${id} is not a string`
      );
    });

    it("should throw error on object Id", () => {
      const id = { hello: "world" };

      expect(id.constructor).toBe(Object);
      expect(() => thegamesDbApi.retrieveGamesByPlatform(id)).toThrowError(
        `${id} is not a string`
      );
    });

    it("should throw error on boolean Id", () => {
      const id = false;

      expect(typeof id).toBe("boolean");
      expect(() => thegamesDbApi.retrieveGamesByPlatform(id)).toThrowError(
        `${id} is not a string`
      );
    });

    it("should throw error on function Id", () => {
      const id = () => console.log("hello");

      expect(typeof id).toBe("function");
      expect(() => thegamesDbApi.retrieveGamesByPlatform(id)).toThrowError(
        `${id} is not a string`
      );
    });

    it("should throw error when Id is a float number", () => {
      const id = "1.23";

      expect(() => thegamesDbApi.retrieveGamesByPlatform(id)).toThrowError(
        `${id} should be an integer number`
      );
    });
  });

  describe("async fails", () => {
    beforeEach(() => {
      thegamesDbApi.apiKey = apiKey;
      thegamesDbApi.proxy = "https://skylabcoders.herokuapp.com/proxy?url=";
    });

    it("should throw error when PlatformId doesn't exists on database", () => {
      const platformID = "9823749872394872983";

      return thegamesDbApi
        .retrieveGamesByPlatform(platformID)
        .then(() => {
          throw Error("should not pass by here");
        })
        .catch(({ message }) =>
          expect(message).toBe(`${platformID} doesn't exist in database`)
        );
    });
    it("should fail on server down", () => {
      const platformID = "1";
      thegamesDbApi.proxy = "https://skylabcoders.hulioapp.com/proxy?url=";

      return thegamesDbApi
        .retrieveGamesByPlatform(platformID)
        .then(() => {
          throw Error("should not pass by here");
        })
        .catch(({ message }) => expect(message).toBe(`Network request failed`));
    });
    it("should fail on non valid API key", () => {
      const platformID = "1";
      thegamesDbApi.apiKey = "HULIO";

      return thegamesDbApi
        .retrieveGamesByPlatform(platformID)
        .then(() => {
          throw Error("should not pass by here");
        })
        .catch(({ message }) =>
          expect(message).toBe(
            `This route requires and API key and no API key was provided.`
          )
        );
    });
  });
});
