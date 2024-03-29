import { SimplePermutation } from './permutation';
import { Twist } from './twist';

export type BaseMove =
  | 'b'
  | 'B'
  | 'd'
  | 'D'
  | 'E'
  | 'f'
  | 'F'
  | 'l'
  | 'L'
  | 'M'
  | 'r'
  | 'R'
  | 'S'
  | 'u'
  | 'U'
  | 'x'
  | 'y'
  | 'z';

export const baseMoves: Record<
  BaseMove,
  { permutation: SimplePermutation; twist: Twist }
> = {
  b: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(0 36 144 108)(1 40 149 111)(2 38 146 110)(3 37 148 113)(4 41 147 109)(5 39 145 112)(6 42 150 114)(7 46 155 117)(8 44 152 116)(9 43 154 119)(10 47 153 115)(11 45 151 118)(18 90 126 54)(19 94 131 57)(20 92 128 56)(21 91 130 59)(22 95 129 55)(23 93 127 58)(24 96 132 60)(25 100 137 63)(26 98 134 62)(27 97 136 65)(28 101 135 61)(29 99 133 64)'
    ),
    twist: new Twist({ axis: 'z', orders: { B: -1, S: -1 } }),
  },
  B: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(0 36 144 108)(1 40 149 111)(2 38 146 110)(3 37 148 113)(4 41 147 109)(5 39 145 112)(18 90 126 54)(19 94 131 57)(20 92 128 56)(21 91 130 59)(22 95 129 55)(23 93 127 58)'
    ),
    twist: new Twist({ axis: 'z', orders: { B: -1 } }),
  },
  d: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(18 33 140 130)(19 31 139 127)(20 34 138 129)(21 32 142 126)(22 30 141 128)(23 35 143 131)(24 87 134 76)(25 85 133 73)(26 88 132 75)(27 86 136 72)(28 84 135 74)(29 89 137 77)(36 51 158 148)(37 49 157 145)(38 52 156 147)(39 50 160 144)(40 48 159 146)(41 53 161 149)(42 105 152 94)(43 103 151 91)(44 106 150 93)(45 104 154 90)(46 102 153 92)(47 107 155 95)'
    ),
    twist: new Twist({ axis: 'y', orders: { E: 1, D: 1 } }),
  },
  D: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(36 51 158 148)(37 49 157 145)(38 52 156 147)(39 50 160 144)(40 48 159 146)(41 53 161 149)(42 105 152 94)(43 103 151 91)(44 106 150 93)(45 104 154 90)(46 102 153 92)(47 107 155 95)'
    ),
    twist: new Twist({ axis: 'y', orders: { D: 1 } }),
  },
  E: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(18 33 140 130)(19 31 139 127)(20 34 138 129)(21 32 142 126)(22 30 141 128)(23 35 143 131)(24 87 134 76)(25 85 133 73)(26 88 132 75)(27 86 136 72)(28 84 135 74)(29 89 137 77)'
    ),
    twist: new Twist({ axis: 'y', orders: { E: 1 } }),
  },
  f: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(6 114 150 42)(7 117 155 46)(8 116 152 44)(9 119 154 43)(10 115 153 47)(11 118 151 45)(12 120 156 48)(13 123 161 52)(14 122 158 50)(15 125 160 49)(16 121 159 53)(17 124 157 51)(24 60 132 96)(25 63 137 100)(26 62 134 98)(27 65 136 97)(28 61 135 101)(29 64 133 99)(30 66 138 102)(31 69 143 106)(32 68 140 104)(33 71 142 103)(34 67 141 107)(35 70 139 105)'
    ),
    twist: new Twist({ axis: 'z', orders: { S: 1, F: 1 } }),
  },
  F: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(12 120 156 48)(13 123 161 52)(14 122 158 50)(15 125 160 49)(16 121 159 53)(17 124 157 51)(30 66 138 102)(31 69 143 106)(32 68 140 104)(33 71 142 103)(34 67 141 107)(35 70 139 105)'
    ),
    twist: new Twist({ axis: 'z', orders: { F: 1 } }),
  },
  l: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(0 17 50 37)(1 12 53 38)(2 13 48 41)(3 15 51 39)(4 16 52 40)(5 14 49 36)(6 35 44 19)(7 30 47 20)(8 31 42 23)(9 33 45 21)(10 34 46 22)(11 32 43 18)(54 71 104 91)(55 66 107 92)(56 67 102 95)(57 69 105 93)(58 70 106 94)(59 68 103 90)(60 89 98 73)(61 84 101 74)(62 85 96 77)(63 87 99 75)(64 88 100 76)(65 86 97 72)'
    ),
    twist: new Twist({ axis: 'x', orders: { L: -1, M: -1 } }),
  },
  L: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(0 17 50 37)(1 12 53 38)(2 13 48 41)(3 15 51 39)(4 16 52 40)(5 14 49 36)(6 35 44 19)(7 30 47 20)(8 31 42 23)(9 33 45 21)(10 34 46 22)(11 32 43 18)'
    ),
    twist: new Twist({ axis: 'x', orders: { L: -1 } }),
  },
  M: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(54 71 104 91)(55 66 107 92)(56 67 102 95)(57 69 105 93)(58 70 106 94)(59 68 103 90)(60 89 98 73)(61 84 101 74)(62 85 96 77)(63 87 99 75)(64 88 100 76)(65 86 97 72)'
    ),
    twist: new Twist({ axis: 'x', orders: { M: -1 } }),
  },
  r: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(54 91 104 71)(55 92 107 66)(56 95 102 67)(57 93 105 69)(58 94 106 70)(59 90 103 68)(60 73 98 89)(61 74 101 84)(62 77 96 85)(63 75 99 87)(64 76 100 88)(65 72 97 86)(108 145 158 125)(109 146 161 120)(110 149 156 121)(111 147 159 123)(112 148 160 124)(113 144 157 122)(114 127 152 143)(115 128 155 138)(116 131 150 139)(117 129 153 141)(118 130 154 142)(119 126 151 140)'
    ),
    twist: new Twist({ axis: 'x', orders: { M: 1, R: 1 } }),
  },
  R: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(108 145 158 125)(109 146 161 120)(110 149 156 121)(111 147 159 123)(112 148 160 124)(113 144 157 122)(114 127 152 143)(115 128 155 138)(116 131 150 139)(117 129 153 141)(118 130 154 142)(119 126 151 140)'
    ),
    twist: new Twist({ axis: 'x', orders: { R: 1 } }),
  },
  S: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(6 114 150 42)(7 117 155 46)(8 116 152 44)(9 119 154 43)(10 115 153 47)(11 118 151 45)(24 60 132 96)(25 63 137 100)(26 62 134 98)(27 65 136 97)(28 61 135 101)(29 64 133 99)'
    ),
    twist: new Twist({ axis: 'z', orders: { S: 1 } }),
  },
  u: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(0 112 122 15)(1 109 121 13)(2 111 120 16)(3 108 124 14)(4 110 123 12)(5 113 125 17)(6 58 116 69)(7 55 115 67)(8 57 114 70)(9 54 118 68)(10 56 117 66)(11 59 119 71)(18 130 140 33)(19 127 139 31)(20 129 138 34)(21 126 142 32)(22 128 141 30)(23 131 143 35)(24 76 134 87)(25 73 133 85)(26 75 132 88)(27 72 136 86)(28 74 135 84)(29 77 137 89)'
    ),
    twist: new Twist({ axis: 'y', orders: { U: -1, E: -1 } }),
  },
  U: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(0 112 122 15)(1 109 121 13)(2 111 120 16)(3 108 124 14)(4 110 123 12)(5 113 125 17)(6 58 116 69)(7 55 115 67)(8 57 114 70)(9 54 118 68)(10 56 117 66)(11 59 119 71)'
    ),
    twist: new Twist({ axis: 'y', orders: { U: -1 } }),
  },
  x: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(0 37 50 17)(1 38 53 12)(2 41 48 13)(3 39 51 15)(4 40 52 16)(5 36 49 14)(6 19 44 35)(7 20 47 30)(8 23 42 31)(9 21 45 33)(10 22 46 34)(11 18 43 32)(54 91 104 71)(55 92 107 66)(56 95 102 67)(57 93 105 69)(58 94 106 70)(59 90 103 68)(60 73 98 89)(61 74 101 84)(62 77 96 85)(63 75 99 87)(64 76 100 88)(65 72 97 86)(108 145 158 125)(109 146 161 120)(110 149 156 121)(111 147 159 123)(112 148 160 124)(113 144 157 122)(114 127 152 143)(115 128 155 138)(116 131 150 139)(117 129 153 141)(118 130 154 142)(119 126 151 140)'
    ),
    twist: new Twist({ axis: 'x', orders: { L: 1, M: 1, R: 1 } }),
  },
  y: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(0 112 122 15)(1 109 121 13)(2 111 120 16)(3 108 124 14)(4 110 123 12)(5 113 125 17)(6 58 116 69)(7 55 115 67)(8 57 114 70)(9 54 118 68)(10 56 117 66)(11 59 119 71)(18 130 140 33)(19 127 139 31)(20 129 138 34)(21 126 142 32)(22 128 141 30)(23 131 143 35)(24 76 134 87)(25 73 133 85)(26 75 132 88)(27 72 136 86)(28 74 135 84)(29 77 137 89)(36 148 158 51)(37 145 157 49)(38 147 156 52)(39 144 160 50)(40 146 159 48)(41 149 161 53)(42 94 152 105)(43 91 151 103)(44 93 150 106)(45 90 154 104)(46 92 153 102)(47 95 155 107)'
    ),
    twist: new Twist({ axis: 'y', orders: { U: -1, E: -1, D: -1 } }),
  },
  z: {
    permutation: new SimplePermutation(27 * 6).setFromCycles(
      '(0 108 144 36)(1 111 149 40)(2 110 146 38)(3 113 148 37)(4 109 147 41)(5 112 145 39)(6 114 150 42)(7 117 155 46)(8 116 152 44)(9 119 154 43)(10 115 153 47)(11 118 151 45)(12 120 156 48)(13 123 161 52)(14 122 158 50)(15 125 160 49)(16 121 159 53)(17 124 157 51)(18 54 126 90)(19 57 131 94)(20 56 128 92)(21 59 130 91)(22 55 129 95)(23 58 127 93)(24 60 132 96)(25 63 137 100)(26 62 134 98)(27 65 136 97)(28 61 135 101)(29 64 133 99)(30 66 138 102)(31 69 143 106)(32 68 140 104)(33 71 142 103)(34 67 141 107)(35 70 139 105)'
    ),
    twist: new Twist({ axis: 'z', orders: { B: 1, S: 1, F: 1 } }),
  },
};
