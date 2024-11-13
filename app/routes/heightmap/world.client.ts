import dat, { GUI } from "dat.gui";
import {
  Color,
  FrontSide,
  Geometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Scene,
  TextureLoader,
  Vector2,
  Vector3,
  VertexColors,
} from "three";
import { OrbitControls } from "three-orbitcontrols-ts";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { game } from "./game";
import { graphics } from "./graphics";
import { math } from "./math";
import { Noise } from "./noise";
import { TextureAtlas } from "./textures";

let instance: ProceduralTerrain_Demo | null = null;
export default function World() {
  if (!instance) {
    instance = new ProceduralTerrain_Demo();
  }
  return instance;
}

type guiProps = {
  guiParams: Record<string, any>;
  gui: GUI;
  scene: Scene;
};
class ProceduralTerrain_Demo extends game.Game {
  private _textures!: TextureAtlas;
  private _controls!: OrbitControls;
  _gui!: GUI;
  _guiParams!: guiProps["guiParams"];

  constructor() {
    super();
  }

  _OnInitialize() {
    this._textures = new TextureAtlas(this);
    this._textures.onLoad = () => {
      console.log("textures loaded!");
    };
    this._controls = this._CreateControls();
    this._CreateGUI();

    this._entities["_terrain"] = new TerrainChunkManager({
      scene: this._graphics.Scene,
      gui: this._gui,
      guiParams: this._guiParams,
    });

    this._entities["_sky"] = new TerrainSky({
      scene: this._graphics.Scene,
      gui: this._gui,
      guiParams: this._guiParams,
    });
    // this._LoadBackground();
  }
  private _CreateGUI() {
    this._guiParams = {
      general: {},
    };
    this._gui = new dat.GUI();
    this._gui.close();
  }

  private _CreateControls() {
    const controls = new OrbitControls(
      this._graphics._camera,
      this._graphics._threejs.domElement
    );
    controls.target.set(0, 50, 0);
    controls.object.position.set(475, 345, 900);
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();
    return controls;
  }

  _LoadDefaultBackground() {
    const loader = new TextureLoader(this._textures._manager);
    loader.load("/resources/heightmap-simondev.jpg", (result) => {
      this._entities["_terrain"].SetHeightmap(result.image);
    });
  }
  onLoadBackground(url: string) {
    const loader = new TextureLoader();
    loader.load(url, (result) => {
      this._entities["_terrain"].SetHeightmap(result.image);
    });
  }
  onDispose() {
    this.onDispose();
  }
  _OnStep(timeInSeconds: number) {}
}
class TerrainSky {
  private _sky!: Sky;

  constructor(params: guiProps) {
    this._Init(params);
  }

  private _Init(params: guiProps) {
    this._sky = new Sky();
    this._sky.scale.setScalar(10000);
    params.scene.add(this._sky);

    params.guiParams.sky = {
      turbidity: 10.0,
      rayleigh: 2,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.8,
      luminance: 1,
    };

    params.guiParams.sun = {
      inclination: 0.31,
      azimuth: 0.25,
    };

    const onShaderChange = () => {
      this._sky.material.uniforms.luminance = { value: 1 };
      for (let k in params.guiParams.sky) {
        // console.log(`${k} ${this._sky.material.uniforms[k].value}`);
        this._sky.material.uniforms[k].value = params.guiParams.sky[k];
      }
      for (let k in params.guiParams.general) {
        this._sky.material.uniforms[k].value = params.guiParams.general[k];
      }
    };

    const onSunChange = () => {
      const theta = Math.PI * (params.guiParams.sun.inclination - 0.5);
      const phi = 2 * Math.PI * (params.guiParams.sun.azimuth - 0.5);
      const sunPosition = {
        x: Math.cos(phi),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.sin(phi) * Math.cos(theta),
      };
      this._sky.material.uniforms["sunPosition"].value.copy(sunPosition);
    };

    const skyRollup = params.gui.addFolder("Sky");
    skyRollup
      .add(params.guiParams.sky, "turbidity", 0.1, 30.0)
      .onChange(onShaderChange);
    skyRollup
      .add(params.guiParams.sky, "rayleigh", 0.1, 4.0)
      .onChange(onShaderChange);
    skyRollup
      .add(params.guiParams.sky, "mieCoefficient", 0.0001, 0.1)
      .onChange(onShaderChange);
    skyRollup
      .add(params.guiParams.sky, "mieDirectionalG", 0.0, 1.0)
      .onChange(onShaderChange);
    skyRollup
      .add(params.guiParams.sky, "luminance", 0.0, 2.0)
      .onChange(onShaderChange);

    const sunRollup = params.gui.addFolder("Sun");
    sunRollup
      .add(params.guiParams.sun, "inclination", 0.0, 1.0)
      .onChange(onSunChange);
    sunRollup
      .add(params.guiParams.sun, "azimuth", 0.0, 1.0)
      .onChange(onSunChange);

    onShaderChange();
    onSunChange();
  }

  public Update(timeInSeconds: number) {
    // Update logic here
  }
}
type paramsTerrainChunkManager = {
  guiParams: any;
};
class TerrainChunkManager {
  private _chunkSize: number;
  private _chunks!: { [key: string]: { chunk: any; edges: string[] } };
  private _params: any;
  private _group!: Group;
  private _noise!: Noise;

  constructor(params: guiProps) {
    this._chunkSize = 500;
    this._Init(params);
  }

  private _Init(params: guiProps) {
    this._InitNoise(params);
    this._InitTerrain(params);
  }

  private _InitNoise(params: guiProps) {
    params.guiParams.noise = {
      octaves: 10,
      persistence: 0.5,
      lacunarity: 2.0,
      exponentiation: 3.9,
      height: 64,
      scale: 256.0,
      noiseType: "simplex",
      seed: 1,
    };

    const onNoiseChanged = () => {
      for (let k in this._chunks) {
        this._chunks[k].chunk.Rebuild();
      }
    };

    const noiseRollup = params.gui.addFolder("Terrain.Noise");
    noiseRollup
      .add(params.guiParams.noise, "noiseType", ["simplex", "perlin"])
      .onChange(onNoiseChanged);
    noiseRollup
      .add(params.guiParams.noise, "scale", 64.0, 1024.0)
      .onChange(onNoiseChanged);
    noiseRollup
      .add(params.guiParams.noise, "octaves", 1, 20, 1)
      .onChange(onNoiseChanged);
    noiseRollup
      .add(params.guiParams.noise, "persistence", 0.01, 1.0)
      .onChange(onNoiseChanged);
    noiseRollup
      .add(params.guiParams.noise, "lacunarity", 0.01, 4.0)
      .onChange(onNoiseChanged);
    noiseRollup
      .add(params.guiParams.noise, "exponentiation", 0.1, 10.0)
      .onChange(onNoiseChanged);
    noiseRollup
      .add(params.guiParams.noise, "height", 0, 256)
      .onChange(onNoiseChanged);

    this._noise = new Noise(params.guiParams.noise);

    params.guiParams.heightmap = {
      height: 16,
    };

    const heightmapRollup = params.gui.addFolder("Terrain.Heightmap");
    heightmapRollup
      .add(params.guiParams.heightmap, "height", 0, 128)
      .onChange(onNoiseChanged);
  }

  private _InitTerrain(params: guiProps) {
    params.guiParams.terrain = {
      wireframe: false,
    };

    this._group = new Group();
    this._group.rotation.x = -Math.PI / 2;

    params.scene.add(this._group);

    const terrainRollup = params.gui.addFolder("Terrain");
    terrainRollup.add(params.guiParams.terrain, "wireframe").onChange(() => {
      for (let k in this._chunks) {
        this._chunks[k].chunk._plane.material.wireframe =
          params.guiParams.terrain.wireframe;
      }
    });

    this._chunks = {};
    this._params = params;

    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        this._AddChunk(x, z);
      }
    }
  }

  private _Key(x: number, z: number): string {
    return x + "." + z;
  }

  private _AddChunk(x: number, z: number) {
    const offset = new Vector2(x * this._chunkSize, z * this._chunkSize);
    const chunk = new TerrainChunk({
      group: this._group,
      offset: new Vector3(offset.x, offset.y, 0),
      scale: 1,
      width: this._chunkSize,
      heightGenerators: [
        new HeightGenerator(
          this._noise,
          new Vector2(offset.x, offset.y),
          100000,
          100001
        ),
      ],
    });

    const k = this._Key(x, z);
    const edges: string[] = [];
    for (let xi = -1; xi <= 1; xi++) {
      for (let zi = -1; zi <= 1; zi++) {
        if (xi === 0 || zi === 0) {
          continue;
        }
        edges.push(this._Key(x + xi, z + zi));
      }
    }

    this._chunks[k] = {
      chunk: chunk,
      edges: edges,
    };
  }

  public SetHeightmap(img: HTMLImageElement) {
    const heightmap = new HeightGenerator(
      new Heightmap(this._params.guiParams.heightmap, img),
      new Vector2(0, 0),
      250,
      300
    );

    for (let k in this._chunks) {
      this._chunks[k].chunk._params.heightGenerators.unshift(heightmap);
      this._chunks[k].chunk.Rebuild();
    }
  }

  public Update(timeInSeconds: number) {
    // Update logic here
  }
}

type TerrainChunkParamsProp = {
  width: number;
  scale: number;
  offset: Vector3;
  group: Group;
  heightGenerators: HeightGenerator[];
};
class TerrainChunk {
  private _params: TerrainChunkParamsProp;
  private _plane!: Mesh;

  constructor(params: TerrainChunkParamsProp) {
    this._params = params;
    this._Init(params);
  }

  private _Init(params: TerrainChunkParamsProp) {
    const size = new Vector3(
      params.width * params.scale,
      0,
      params.width * params.scale
    );

    this._plane = new Mesh(
      new PlaneGeometry(size.x, size.z, 128, 128),
      new MeshStandardMaterial({
        wireframe: false,
        color: 0xffffff,
        side: FrontSide,
        vertexColors: VertexColors,
      })
    );
    this._plane.position.add(params.offset);
    this._plane.castShadow = false;
    this._plane.receiveShadow = true;
    params.group.add(this._plane);
    this.Rebuild();
  }

  public Rebuild() {
    const offset = this._params.offset;
    const planeGeometry = this._plane.geometry as Geometry;

    for (let v of planeGeometry.vertices) {
      const heightPairs: [number, number][] = [];
      let normalization = 0;
      v.z = 0;

      for (let gen of this._params.heightGenerators) {
        heightPairs.push(gen.Get(v.x + offset.x, v.y + offset.y));
        normalization += heightPairs[heightPairs.length - 1][1];
      }

      if (normalization > 0) {
        for (let h of heightPairs) {
          v.z += (h[0] * h[1]) / normalization;
        }
      }
    }

    if (
      this._params.heightGenerators.length > 1 &&
      offset.x === 0 &&
      offset.y === 0
    ) {
      const gen = this._params.heightGenerators[0];
      const maxHeight = 16.0;
      const GREEN = new Color(0x46b00c); // Color equivalent to 0x46b00c

      for (let f of planeGeometry.faces) {
        const vs = [
          planeGeometry.vertices[f.a],
          planeGeometry.vertices[f.b],
          planeGeometry.vertices[f.c],
        ];

        const vertexColours: any[] = [];
        for (let v of vs) {
          const [h, _] = gen.Get(v.x + offset.x, v.y + offset.y);
          const a = math.sat(h / maxHeight);
          const vc = new Color(0xffffff); // White color
          vc.lerp(GREEN, a);
          vertexColours.push(vc);
        }
        f.vertexColors = vertexColours;
      }

      planeGeometry.elementsNeedUpdate = true;
    } else {
      for (let f of planeGeometry.faces) {
        f.vertexColors = [
          new Color(0xffffff),
          new Color(0xffffff),
          new Color(0xffffff),
        ];
      }
    }

    planeGeometry.verticesNeedUpdate = true;
    planeGeometry.computeVertexNormals();
  }
}

class Heightmap {
  private _params: { height: number };
  private _data: ImageData;

  constructor(params: { height: number }, img: HTMLImageElement) {
    this._params = params;
    this._data = graphics.GetImageData(img);
  }

  public Get(x: number, y: number): number {
    const _GetPixelAsFloat = (x: number, y: number): number => {
      const position = (x + this._data.width * y) * 4;
      const data = this._data.data;
      return data[position] / 255.0;
    };

    const offset = new Vector2(-250, -250);
    const dimensions = new Vector2(500, 500);

    const xf = 1.0 - math.sat((x - offset.x) / dimensions.x);
    const yf = math.sat((y - offset.y) / dimensions.y);
    const w = this._data.width - 1;
    const h = this._data.height - 1;

    const x1 = Math.floor(xf * w);
    const y1 = Math.floor(yf * h);
    const x2 = math.clamp(x1 + 1, 0, w);
    const y2 = math.clamp(y1 + 1, 0, h);

    const xp = xf * w - x1;
    const yp = yf * h - y1;

    const p11 = _GetPixelAsFloat(x1, y1);
    const p21 = _GetPixelAsFloat(x2, y1);
    const p12 = _GetPixelAsFloat(x1, y2);
    const p22 = _GetPixelAsFloat(x2, y2);

    const px1 = math.lerp(xp, p11, p21);
    const px2 = math.lerp(xp, p12, p22);
    return math.lerp(yp, px1, px2) * this._params.height;
  }
}

class BumpHeightGenerator {
  constructor() {}

  public Get(x: number, y: number): [number, number] {
    const dist = new Vector2(x, y).distanceTo(new Vector2(0, 0));

    let h = 1.0 - math.sat(dist / 250.0);
    h = h * h * h * (h * (h * 6 - 15) + 10);

    return [h * 128, 1];
  }
}
class FlaredCornerHeightGenerator {
  constructor() {}

  public Get(x: number, y: number) {
    if (x === -250 && y === 250) {
      return [128, 1];
    }
    return [0, 1];
  }
}

class HeightGenerator {
  private _position: Vector2;
  private _radius: [number, number];
  private _generator: { Get: (x: number, y: number) => number };

  constructor(
    generator: { Get: (x: number, y: number) => number },
    position: Vector2,
    minRadius: number,
    maxRadius: number
  ) {
    this._position = position.clone();
    this._radius = [minRadius, maxRadius];
    this._generator = generator;
  }

  public Get(x: number, y: number): [number, number] {
    const distance = this._position.distanceTo(new Vector2(x, y));
    let normalization =
      1.0 -
      math.sat(
        (distance - this._radius[0]) / (this._radius[1] - this._radius[0])
      );
    normalization = normalization * normalization * (3 - 2 * normalization);

    return [this._generator.Get(x, y), normalization];
  }
}
