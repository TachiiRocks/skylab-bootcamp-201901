"use strict";

describe("logic", function() {
  var name = "Peter";
  var surname = "Seller";
  var email = "peterseller@gmail.com";
  var password = "123";

  beforeEach(function() {
    users.length = 0;
  });

  describe("register", function() {
    it("should succeed on correct data", function() {
      var user = {
        name: name,
        surname: surname,
        email: email,
        password: password
      };

      var currentUsersCount = users.length;

      logic.register(name, surname, email, password);

      expect(users.length).toBe(currentUsersCount + 1);

      var lastUser = users[users.length - 1];
      expect(lastUser).toEqual(user);
    });

    it("should fail on undefined name", function() {
      expect(function() {
        logic.register(undefined, surname, email, password);
      }).toThrowError(TypeError, "undefined is not a valid name");
    });
  });

  describe("login", function() {
    beforeEach(function() {
      users.push({
        name: name,
        surname: surname,
        email: email,
        password: password
      });
    });

    it("should succeed on correct data", function() {
      logic.login(email, password);

      expect(logic.__userEmail__).toBe(email);
      expect(logic.__accessTime__ / 1000).toBeCloseTo(Date.now() / 1000, 1);
    });

    it("should fail on wrong email (unexisting user)", function() {
      // expect(function() {
      //     logic.login('pepitogrillo@gmail.com', password);
      // }).toThrowError(Error, 'wrong credentials');

      var _error;

      try {
        logic.login("pepitogrillo@gmail.com", password);
      } catch (error) {
        _error = error;
      }

      expect(_error).toBeDefined();
      expect(_error.code).toBe(1);
    });

    it("should fail on wrong password (existing user)", function() {
      // expect(function() {
      //     logic.login(email, '456');
      // }).toThrowError(Error, 'wrong credentials');

      var _error;

      try {
        logic.login(email, "456");
      } catch (error) {
        _error = error;
      }

      expect(_error).toBeDefined();
      expect(_error.code).toBe(1);
    });

    // TODO fail cases
  });

  describe("search ducks", function() {
    it("should succeed on correct query", function(done) {
      logic.searchDucks("yellow", function(ducks) {
        expect(ducks).toBeDefined();
        expect(ducks instanceof Array).toBeTruthy();
        expect(ducks.length).toBe(13);
        done();
      });
    });

    it("should break if query is undefined", function(done) {
      expect(function () { logic.searchDucks(undefined)}).toThrowError(Error, "undefined is not a valid query");
    });

    it('should break if invalid callback is provided', function() {
        expect(function () { logic.searchDucks('yellow', 1) }).toThrowError(Error, 'callback is not a function');
      });
    // TODO fail cases
  });
});
