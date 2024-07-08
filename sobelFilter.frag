#version 330 core
out vec4 FragColour;

in vec2 TexCoords;

uniform sampler2D screenTexture;

const float offset = 1.0 / 2500.0;
const float pi = 3.1415926;

void main() {
	vec2 offsets[9] = vec2[](
		vec2(-offset,  offset), // top-left
		vec2(    0.0,  offset), // top-center
		vec2( offset,  offset), // top-right
		vec2(-offset,     0.0), // center-left
		vec2(    0.0,     0.0), // center-center
		vec2( offset,     0.0), // center-right
		vec2(-offset, -offset), // bottom-left
		vec2(    0.0, -offset), // bottom-center
		vec2( offset, -offset)  // bottom-right
	);

	float sobelX[9] = float[](
		 1,  0, -1,
		 2,  0, -2,
		 1,  0, -1
	);

	float sobelY[9] = float[](
		 1,  2,  1,
		 0,  0,  0,
		-1, -2, -1
	);

	vec3 sampleTex[9];
	for (int i = 0; i < 9; ++i) {
		sampleTex[i] = vec3(texture(screenTexture, TexCoords.st + offsets[i]));
	}

	float sumX = 0.0;
	float sumY = 0.0;
	for(int i = 0; i < 9; ++i) {
		sumX += dot(sampleTex[i], vec3(0.2126, 0.7152, 0.0722)) * sobelX[i];
		sumY += dot(sampleTex[i], vec3(0.2126, 0.7152, 0.0722)) * sobelY[i];
	}

	float magnitude = sqrt(sumX * sumX + sumY * sumY);
	float direction = atan(sumY, sumX);

	if (direction < 0) {
		direction += pi * 2;
	}

	if (direction >= pi) {
		direction -= pi;
	}

	float inverseDirection = pi - direction;

	float normalisedDirection = (direction / pi);
	float normalisedInverse = (inverseDirection / pi);

	//float redValue = getRedValue(normalisedDirection, magnitude);
	float redValue = magnitude * max(normalisedDirection, normalisedInverse);
	float greenValue = magnitude * (1.0 - max(normalisedDirection, normalisedInverse));

	FragColour = vec4(vec3(redValue, greenValue, 0.0), 1.0);
}
