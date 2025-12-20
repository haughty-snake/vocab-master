/**
 * VocabMaster Version Management
 *
 * 시멘틱 버저닝 (Semantic Versioning) 사용
 * MAJOR.MINOR.PATCH
 * - MAJOR: 하위 호환성이 없는 변경
 * - MINOR: 하위 호환성이 있는 기능 추가
 * - PATCH: 하위 호환성이 있는 버그 수정
 */

const Version = {
    // 현재 앱 버전
    CURRENT: '1.0.0',

    // 버전 히스토리 및 호환성 정보
    HISTORY: {
        '1.0.0': {
            releaseDate: '2024-12-21',
            description: '초기 시멘틱 버전',
            changes: [
                '시멘틱 버저닝 도입',
                '다의어 지원 (meanings 배열)',
                '사용자 카테고리 기능',
                '영영사전 조회 기능',
                '플래시카드/블링크/퀴즈 모드'
            ],
            dataFormat: {
                progress: 'object (wordId: status)',
                settings: 'object (darkMode, pronunciation, ui)',
                stats: 'object (totalStudyTime, sessionsCount)',
                customCategories: 'array of category objects',
                disabledCategories: 'array of category ids'
            }
        }
    },

    // 버전 비교 함수
    // 반환값: -1 (v1 < v2), 0 (v1 == v2), 1 (v1 > v2)
    compare(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);

        for (let i = 0; i < 3; i++) {
            const p1 = parts1[i] || 0;
            const p2 = parts2[i] || 0;
            if (p1 < p2) return -1;
            if (p1 > p2) return 1;
        }
        return 0;
    },

    // 버전 유효성 검사
    isValid(version) {
        if (!version) return false;
        const regex = /^\d+\.\d+\.\d+$/;
        return regex.test(version);
    },

    // 이전 버전 형식을 시멘틱 버전으로 변환
    normalize(version) {
        if (!version) return '0.0.0';

        // 이미 시멘틱 버전인 경우
        if (this.isValid(version)) return version;

        // 이전 버전 형식 변환 (예: '2.1' -> '0.2.1')
        if (typeof version === 'string') {
            const parts = version.split('.');
            if (parts.length === 2) {
                return `0.${parts[0]}.${parts[1]}`;
            }
            if (parts.length === 1) {
                return `0.${parts[0]}.0`;
            }
        }

        return '0.0.0';
    },

    // 호환성 검사
    // 하위 버전 데이터를 상위 버전에서 import 가능
    isCompatible(importVersion, currentVersion = this.CURRENT) {
        const normalizedImport = this.normalize(importVersion);
        const comparison = this.compare(normalizedImport, currentVersion);

        // 같거나 낮은 버전은 호환 가능
        return comparison <= 0;
    },

    // 데이터 마이그레이션
    migrate(data, fromVersion) {
        const normalizedFrom = this.normalize(fromVersion);
        let migratedData = { ...data };

        // 0.x.x (이전 버전) -> 1.0.0 마이그레이션
        if (this.compare(normalizedFrom, '1.0.0') < 0) {
            migratedData = this.migrateToV1(migratedData);
        }

        // 향후 버전 마이그레이션 추가 시:
        // if (this.compare(normalizedFrom, '2.0.0') < 0) {
        //     migratedData = this.migrateToV2(migratedData);
        // }

        migratedData.version = this.CURRENT;
        return migratedData;
    },

    // 0.x.x -> 1.0.0 마이그레이션
    migrateToV1(data) {
        // 이전 버전 데이터 구조를 1.0.0에 맞게 변환
        const migrated = { ...data };

        // customCategories 내 단어 구조 확인 및 변환
        if (migrated.customCategories) {
            migrated.customCategories = migrated.customCategories.map(cat => {
                if (cat.words) {
                    cat.words = cat.words.map(word => {
                        // 구형 meaning -> 신형 meanings 변환
                        if (word.meaning && !word.meanings) {
                            word.meanings = [{
                                meaning: word.meaning,
                                partOfSpeech: word.partOfSpeech || '',
                                examples: word.examples || []
                            }];
                        }
                        return word;
                    });
                }
                return cat;
            });
        }

        return migrated;
    },

    // 버전 정보 문자열 생성
    getVersionInfo() {
        return `VocabMaster v${this.CURRENT}`;
    },

    // 상세 버전 정보
    getDetailedInfo() {
        const info = this.HISTORY[this.CURRENT];
        return {
            version: this.CURRENT,
            releaseDate: info?.releaseDate || 'Unknown',
            description: info?.description || '',
            changes: info?.changes || []
        };
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.Version = Version;
}
