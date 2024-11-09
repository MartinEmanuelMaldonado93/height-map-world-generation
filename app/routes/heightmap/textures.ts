import * as THREE from "three";

export const textures = (function () {
  return {
    TextureAtlas: class {
      private _game: any;
      private _manager: THREE.LoadingManager = new THREE.LoadingManager();
      private _loader: THREE.TextureLoader = new THREE.TextureLoader();
      private _textures!: { [key: string]: any; };
      public onLoad: () => void;

      constructor(game: any) {
        this._game = game;
        this._Create(game);
        this.onLoad = () => {};
      }

      private _Create(game: any) {
        this._manager = new THREE.LoadingManager();
        this._loader = new THREE.TextureLoader(this._manager);
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
          this._textures[name].texture.minFilter =
            THREE.LinearMipMapLinearFilter;
          this._textures[name].texture.magFilter = THREE.NearestFilter;
          this._textures[name].texture.wrapS = THREE.RepeatWrapping;
          this._textures[name].texture.wrapT = THREE.RepeatWrapping;
          this._textures[name].texture.anisotropy = aniso;
        }
      }
    },
  };
})();
