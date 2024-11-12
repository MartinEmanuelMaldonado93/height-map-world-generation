import {
  LoadingManager,
  TextureLoader,
  LinearMipMapLinearFilter,
  NearestFilter,
  RepeatWrapping,
} from "three";
import { _Game } from "./game";

export class TextureAtlas {
  private _game: _Game;
  public _manager: LoadingManager = new LoadingManager();
  private _loader: TextureLoader = new TextureLoader();
  private _textures!: { [key: string]: any };
  onLoad: () => void;

  constructor(game: _Game) {
    this._game = game;
    this._Create(game);
    this.onLoad = () => {};
  }

  private _Create(game: _Game) {
    this._manager = new LoadingManager();
    this._loader = new TextureLoader(this._manager);
    this._textures = {};

    this._manager.onLoad = () => {
      this._OnLoad();
    };

    this._game = game;
  }

  get Info() {
    return this._textures;
  }

  private _OnLoad() {
    this.onLoad();
  }

  private _LoadType(
    name: string,
    textureNames: string[],
    offset: { x: number; y: number },
    colourRange: any
  ) {
    this._textures[name] = {
      colourRange,
      uvOffset: [offset.x, offset.y],
      textures: textureNames.map((n) => this._loader.load(n)),
    };

    if (this._textures[name].textures.length <= 1) {
      const caps = this._game._graphics._threejs.capabilities;

      const aniso = caps.getMaxAnisotropy();

      this._textures[name].texture = this._textures[name].textures[0];
      this._textures[name].texture.minFilter = LinearMipMapLinearFilter;
      this._textures[name].texture.magFilter = NearestFilter;
      this._textures[name].texture.wrapS = RepeatWrapping;
      this._textures[name].texture.wrapT = RepeatWrapping;
      this._textures[name].texture.anisotropy = aniso;
    }
  }
}
