describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            chai.assert.equal(-1, [1, 2, 3].indexOf(5));
            chai.assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });
});

describe('Model', function () {
    it('should return model with title Rubiks Cube', function () {
        var modelTitle = "Rubiks Cube";

        $.get(
            "/api/model/57ab39dd0fdfe27c28ac7a9f",
            function (data) {
                console.log(data);
                chai.assert.equal(data.Title, modelTitle);
            }
        )
    })
});

describe('ModelURL', function () {
    it('should return model with url /Models/Model3.json', function () {
        var modelUrl = "/Models/Model3.json";

        $.get(
            "/api/urlodel/57ab39dd0fdfe27c28ac7a9f",
            function (data) {
                console.log(data);
                chai.assert.equal(data, modelUrl);
            }
        )
    })
});

describe('ModelURL', function () {
    it('user should be undefined unless logged in', function () {

        $.get(
            "/api/user",
            function (data) {
                console.log(data);
                chai.assert.equal(data.data, "");
            }
        )
    })
});