import { cloneDeep, uniqueId } from 'lodash';
import { CubeSlice, CubeSliceX, CubeSliceY, CubeSliceZ } from './app.component';
import { Permutation } from './permutation';

class BaseMove extends Permutation {
  constructor(private readonly name: CubeSlice) {
    super(27 * 6);

    this.setFromCycles(
      {
        B: '(0 36 144 108)(1 40 149 111)(2 38 146 110)(3 37 148 113)(4 41 147 109)(5 39 145 112)(18 90 126 54)(19 94 131 57)(20 92 128 56)(21 91 130 59)(22 95 129 55)(23 93 127 58)',
        D: '(36 51 158 148)(37 49 157 145)(38 52 156 147)(39 50 160 144)(40 48 159 146)(41 53 161 149)(42 105 152 94)(43 103 151 91)(44 106 150 93)(45 104 154 90)(46 102 153 92)(47 107 155 95)',
        E: '(18 33 140 130)(19 31 139 127)(20 34 138 129)(21 32 142 126)(22 30 141 128)(23 35 143 131)(24 87 134 76)(25 85 133 73)(26 88 132 75)(27 86 136 72)(28 84 135 74)(29 89 137 77)',
        F: '(12 120 156 48)(13 123 161 52)(14 122 158 50)(15 125 160 49)(16 121 159 53)(17 124 157 51)(30 66 138 102)(31 69 143 106)(32 68 140 104)(33 71 142 103)(34 67 141 107)(35 70 139 105)',
        L: '(0 17 50 37)(1 12 53 38)(2 13 48 41)(3 15 51 39)(4 16 52 40)(5 14 49 36)(6 35 44 19)(7 30 47 20)(8 31 42 23)(9 33 45 21)(10 34 46 22)(11 32 43 18)',
        M: '(54 71 104 91)(55 66 107 92)(56 67 102 95)(57 69 105 93)(58 70 106 94)(59 68 103 90)(60 89 98 73)(61 84 101 74)(62 85 96 77)(63 87 99 75)(64 88 100 76)(65 86 97 72)',
        R: '(108 145 158 125)(109 146 161 120)(110 149 156 121)(111 147 159 123)(112 148 160 124)(113 144 157 122)(114 127 152 143)(115 128 155 138)(116 131 150 139)(117 129 153 141)(118 130 154 142)(119 126 151 140)',
        S: '(6 114 150 42)(7 117 155 46)(8 116 152 44)(9 119 154 43)(10 115 153 47)(11 118 151 45)(24 60 132 96)(25 63 137 100)(26 62 134 98)(27 65 136 97)(28 61 135 101)(29 64 133 99)',
        U: '(0 112 122 15)(1 109 121 13)(2 111 120 16)(3 108 124 14)(4 110 123 12)(5 113 125 17)(6 58 116 69)(7 55 115 67)(8 57 114 70)(9 54 118 68)(10 56 117 66)(11 59 119 71)',
      }[this.name]
    );
  }
}

const moves: Record<string, Pick<Move, 'domain' | 'permutation'>> = {
  b: {
    domain: {
      slice: 'z',
      directions: { B: -1, S: -1 },
    },
    permutation: new BaseMove('B').apply(new BaseMove('S').inverse()),
  },
  B: {
    domain: {
      slice: 'z',
      directions: { B: -1 },
    },
    permutation: new BaseMove('B'),
  },
  d: {
    domain: {
      slice: 'y',
      directions: { E: 1, D: 1 },
    },
    permutation: new BaseMove('E').apply(new BaseMove('D')),
  },
  D: {
    domain: {
      slice: 'y',
      directions: { D: 1 },
    },
    permutation: new BaseMove('D'),
  },
  E: {
    domain: {
      slice: 'y',
      directions: { E: 1 },
    },
    permutation: new BaseMove('E'),
  },
  f: {
    domain: {
      slice: 'z',
      directions: { S: 1, F: 1 },
    },
    permutation: new BaseMove('S').apply(new BaseMove('F')),
  },
  F: {
    domain: {
      slice: 'z',
      directions: { F: 1 },
    },
    permutation: new BaseMove('F'),
  },
  l: {
    domain: {
      slice: 'x',
      directions: { L: -1, M: -1 },
    },
    permutation: new BaseMove('L').apply(new BaseMove('M')),
  },
  L: {
    domain: {
      slice: 'x',
      directions: { L: -1 },
    },
    permutation: new BaseMove('L'),
  },
  M: {
    domain: {
      slice: 'x',
      directions: { M: -1 },
    },
    permutation: new BaseMove('M'),
  },
  r: {
    domain: {
      slice: 'x',
      directions: { M: 1, R: 1 },
    },
    permutation: new BaseMove('M').inverse().apply(new BaseMove('R')),
  },
  R: {
    domain: {
      slice: 'x',
      directions: { R: 1 },
    },
    permutation: new BaseMove('R'),
  },
  S: {
    domain: {
      slice: 'z',
      directions: { S: 1 },
    },
    permutation: new BaseMove('S'),
  },
  u: {
    domain: {
      slice: 'y',
      directions: { U: -1, E: -1 },
    },
    permutation: new BaseMove('U').apply(new BaseMove('E').inverse()),
  },
  U: {
    domain: {
      slice: 'y',
      directions: { U: -1 },
    },
    permutation: new BaseMove('U'),
  },
  x: {
    domain: {
      slice: 'x',
      directions: { L: 1, M: 1, R: 1 },
    },
    permutation: new BaseMove('L')
      .inverse()
      .apply(new BaseMove('M').inverse())
      .apply(new BaseMove('R')),
  },
  y: {
    domain: {
      slice: 'y',
      directions: { U: -1, E: -1, D: -1 },
    },
    permutation: new BaseMove('U')
      .apply(new BaseMove('E').inverse())
      .apply(new BaseMove('D').inverse()),
  },
  z: {
    domain: {
      slice: 'z',
      directions: { B: 1, S: 1, F: 1 },
    },
    permutation: new BaseMove('B')
      .inverse()
      .apply(new BaseMove('S'))
      .apply(new BaseMove('F')),
  },
};

type Slice = 'x' | 'y' | 'z';

export interface Move {
  domain: {
    [S in Slice]: {
      slice: S;
      directions: {
        [_ in {
          x: CubeSliceX;
          y: CubeSliceY;
          z: CubeSliceZ;
        }[S]]?: -1 | 1;
      };
    };
  }[Slice];
  permutation: Permutation;
}

export class Move {
  readonly id: string = uniqueId();

  get size(): number {
    return Object.keys(this.domain.directions).length * 9;
  }

  constructor(private readonly name: string) {
    const { domain, permutation } = moves[this.name];

    this.domain = cloneDeep(domain);
    this.permutation = permutation.clone();
  }
}
