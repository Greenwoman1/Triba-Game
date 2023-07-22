const numberOfRandomSolution = 3;
export const smallBoard = 1;
export const mediumBoard = 2;
export const largeBoard = 3;
export const shapeBoard = 4;

export const arePointsCollinear = (x1, x2, x3) => {
  return (
    ((x2[0] - x1[0]) * (x3[1] - x1[1]) - (x3[0] - x1[0]) * (x2[1] - x1[1])) *
      0.5 ===
    0
  );
};

export const lineIntersection = (line1, line2) => {
  const x1 = line1[0][0];
  const y1 = line1[0][1];
  const x2 = line1[1][0];
  const y2 = line1[1][1];

  const x3 = line2[0][0];
  const y3 = line2[0][1];
  const x4 = line2[1][0];
  const y4 = line2[1][1];
  const t =
    ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) /
    ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
  const u =
    ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) /
    ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
};

export const triangleIntersect = (triangle1, triangle2) => {
  let intersect = false;
  let line11 = [triangle1[0], triangle1[1]];
  let line12 = [triangle1[1], triangle1[2]];
  let line13 = [triangle1[2], triangle1[0]];

  let line21 = [triangle2[0], triangle2[1]];
  let line22 = [triangle2[1], triangle2[2]];
  let line23 = [triangle2[2], triangle2[0]];

  if (
    lineIntersection(line21, line11) ||
    lineIntersection(line22, line11) ||
    lineIntersection(line23, line11) ||
    lineIntersection(line21, line12) ||
    lineIntersection(line22, line12) ||
    lineIntersection(line23, line12) ||
    lineIntersection(line21, line13) ||
    lineIntersection(line22, line13) ||
    lineIntersection(line23, line13)
  ) {
    intersect = true;
  }
  return intersect;
};

export const removePoint = (allPoints, point1, point2, point3) => {
  allPoints = allPoints.filter(
    (point) => point[0] !== point1[0] || point[1] !== point1[1]
  );
  allPoints = allPoints.filter(
    (point) => point[0] !== point2[0] || point[1] !== point2[1]
  );
  allPoints = allPoints.filter(
    (point) => point[0] !== point3[0] || point[1] !== point3[1]
  );
  let pointsToRemove = [];
  for (let i = 0; i < allPoints.length; i++) {
    if (arePointsCollinear(allPoints[i], point1, point2)) {
      if (
        allPoints[i][0] >= Math.min(point1[0], point2[0]) &&
        allPoints[i][0] <= Math.max(point1[0], point2[0])
      ) {
        if (
          allPoints[i][1] >= Math.min(point1[1], point2[1]) &&
          allPoints[i][1] <= Math.max(point1[1], point2[1])
        ) {
          pointsToRemove.push(allPoints[i]);
        }
      }
    }
    if (arePointsCollinear(allPoints[i], point1, point3)) {
      if (
        allPoints[i][0] >= Math.min(point1[0], point3[0]) &&
        allPoints[i][0] <= Math.max(point1[0], point3[0])
      ) {
        if (
          allPoints[i][1] >= Math.min(point1[1], point3[1]) &&
          allPoints[i][1] <= Math.max(point1[1], point3[1])
        ) {
          pointsToRemove.push(allPoints[i]);
        }
      }
    }
    if (arePointsCollinear(allPoints[i], point2, point3)) {
      if (
        allPoints[i][0] >= Math.min(point2[0], point3[0]) &&
        allPoints[i][0] <= Math.max(point2[0], point3[0])
      ) {
        if (
          allPoints[i][1] >= Math.min(point2[1], point3[1]) &&
          allPoints[i][1] <= Math.max(point2[1], point3[1])
        ) {
          pointsToRemove.push(allPoints[i]);
        }
      }
    }
  }
  return allPoints.filter((el) => !pointsToRemove.includes(el));
};

export const isMoveValid = (allTriangles, triangle) => {
  for (let i = 0; i < allTriangles.length; i++) {
    if (triangleIntersect(allTriangles[i], triangle)) {
      return false;
    }
  }
  return true;
};

export const isEndOfGame = (allPoints, allTriangles) => {
  for (let i = 0; i < allPoints.length; i++) {
    for (let j = i + 1; j < allPoints.length; j++) {
      for (let k = j + 1; k < allPoints.length; k++) {
        if (!arePointsCollinear(allPoints[i], allPoints[j], allPoints[k])) {
          if (
            isMoveValid(allTriangles, [
              allPoints[i],
              allPoints[j],
              allPoints[k],
            ])
          )
            return false;
        }
      }
    }
  }
  return true;
};


const score = (allTriangles, aiPlayer) => {
  let aiTriangles = 0;
  let humanTriangles = 0;

  // Count the number of triangles for each player
  for (let i = 0; i < allTriangles.length; i++) {
    if (i % 2 === aiPlayer) {
      aiTriangles++;
    } else {
      humanTriangles++;
    }
  }
  // Return the difference in the number of triangles between the AI and the human player
  return aiTriangles - humanTriangles;
};


const minimax = (allTriangles, allPoints, depth, maximizingPlayer, aiPlayer) => {
  if (depth === 0 || isEndOfGame(allPoints, allTriangles)) {
    return {score: score(allTriangles, aiPlayer), triangle: null};
  }

  let bestValue, bestTriangle;

  if (maximizingPlayer) {
    bestValue = -Infinity;
    for (let i = 0; i < allPoints.length; i++) {
      for (let j = i + 1; j < allPoints.length; j++) {
        for (let k = j + 1; k < allPoints.length; k++) {
          const triangle = [allPoints[i], allPoints[j], allPoints[k]];
          if (isMoveValid(allTriangles, triangle) || !arePointsCollinear(triangle[0], triangle[1], triangle[2])) {
            const newTriangles = [(Array.from(allTriangles)), triangle];
            const value = minimax(newTriangles, allPoints, depth - 1, false).score;
            if (value > bestValue) {
              bestValue = value;
              bestTriangle = triangle;
            }
          }
        }
      }
    }
  } else {
    bestValue = Infinity;
    for (let i = 0; i < allPoints.length; i++) {
      for (let j = i + 1; j < allPoints.length; j++) {
        for (let k = j + 1; k < allPoints.length; k++) {
          const triangle = [allPoints[i], allPoints[j], allPoints[k]];
          if (isMoveValid(allTriangles, triangle) ||
              !arePointsCollinear(triangle[0], triangle[1], triangle[2])) {
            const newTriangles = [(Array.from(allTriangles)), triangle];
            const value = minimax(newTriangles, allPoints, depth - 1, true).score;
            if (value < bestValue) {
              bestValue = value;
              bestTriangle = triangle;
            }
          }
        }
      }
    }
  }

  return {score: bestValue, triangle: bestTriangle};
};


const getMinMaxDepth = (gameType) => {
  if ((gameType === smallBoard) || (gameType === shapeBoard) || (gameType === mediumBoard))
    return 3;
  else return 1;
}

const triangleArea = (point1, point2, point3) => {
  return Math.abs((point1[0] * (point2[1] - point3[1]) + point2[0] * (point3[1] - point2[1]) + point3[0] * (point1[1] - point2[1])) / 2);
}


export const aiMove = (allTriangles, allPoints, gameType, aiPlayer = 1) => {
  const moveCount = allTriangles.length;
  const minMaxDepth = getMinMaxDepth(gameType);

  if ((gameType === mediumBoard && moveCount < 3)  || (gameType === largeBoard && moveCount < 9)) {
    let nextSolution = allPoints.sort(() => 0.5 - Math.random());
    while (
        !isMoveValid(allTriangles, nextSolution) ||
        arePointsCollinear(nextSolution[0], nextSolution[1], nextSolution[2])
        ) {
      let shuffled = allPoints.sort(() => 0.5 - Math.random());
      nextSolution = shuffled.slice(0, 3);
    }
    return nextSolution;
  }

  else{
    let trianglePoints;
    if(minMaxDepth === 1) {
      let bestSolution = (Array.from(allPoints)).sort(() => 0.5 - Math.random());
      while (!isMoveValid(allTriangles, bestSolution) ||
          arePointsCollinear(bestSolution[0], bestSolution[1], bestSolution[2])) {
        let shuffled = (Array.from(allPoints)).sort(() => 0.5 - Math.random());
        bestSolution = shuffled.slice(0, 3);
      }
      for (let i = 1; i < numberOfRandomSolution; i++) {
        let shuffled = (Array.from(allPoints)).sort(() => 0.5 - Math.random());
        trianglePoints = shuffled.slice(0, 3);
        while (!isMoveValid(allTriangles, trianglePoints) ||
            arePointsCollinear(trianglePoints[0], trianglePoints[1], trianglePoints[2])) {
          shuffled = (Array.from(allPoints)).sort(() => 0.5 - Math.random());
          trianglePoints = shuffled.slice(0, 3);
        }
        if (triangleArea(bestSolution[0], bestSolution[1], bestSolution[2]) < triangleArea(trianglePoints[0], trianglePoints[1], trianglePoints[2])) {
          bestSolution = trianglePoints;
        }
      }
      return bestSolution;
    }
    // Use the Minimax algorithm for the remaining moves
    const {triangle} = minimax(allTriangles, allPoints, minMaxDepth, true, aiPlayer);
    return triangle;
  }
};
