function TwoBodyTest() {
	var a = new Planet(game, 200, 200);
	var b = new Planet(game, 600, 200);

	a.velocity.y = 1;
	b.velocity.y = -1;
}
