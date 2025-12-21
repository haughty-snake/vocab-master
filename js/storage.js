/**
 * ============================================================================
 * VocabMaster 로컬 저장소 관리 모듈 (storage.js)
 * ============================================================================
 *
 * [역할]
 * - localStorage를 사용하여 사용자 데이터를 브라우저에 영구 저장
 * - 데이터 보호 메커니즘을 통해 데이터 손실 방지
 * - 백업/복원 기능 제공
 *
 * [저장되는 데이터]
 * 1. progress     : 각 단어의 학습 상태 (new/learning/memorized)
 * 2. settings     : 사용자 설정 (다크모드, 발음표시 등)
 * 3. stats        : 학습 통계 (총 학습수, 연속일 등)
 * 4. customCategories : 사용자 정의 카테고리
 * 5. disabledCategories : 비활성화된 카테고리 목록
 * 6. backupInfo   : 백업 날짜 정보
 *
 * [데이터 보호 메커니즘]
 * - _loadStatus: 각 데이터의 로드 상태 추적 (empty/loaded/corrupted)
 * - corrupted 상태에서는 sessionStorage에 임시 저장하여 데이터 덮어쓰기 방지
 * - recoverTempData(): 이전 세션의 임시 데이터 복구
 *
 * [사용법]
 * 1. Storage.init()으로 초기화 (data.js에서 자동 호출)
 * 2. Storage.setWordStatus(id, status)로 학습 상태 변경
 * 3. Storage.exportData()로 백업
 * 4. Storage.importData(json)로 복원
 *
 * ============================================================================
 */

const Storage = {
    // ========================================================================
    // localStorage 키 정의
    // 모든 키는 'vocabmaster_' 접두사를 사용하여 다른 앱과 충돌 방지
    // ========================================================================
    KEYS: {
        PROGRESS: 'vocabmaster_progress',           // 학습 진도 데이터
        SETTINGS: 'vocabmaster_settings',           // 사용자 설정
        STATS: 'vocabmaster_stats',                 // 학습 통계
        CUSTOM_CATEGORIES: 'vocabmaster_custom_categories',  // 사용자 카테고리
        BACKUP_INFO: 'vocabmaster_backup_info',     // 백업 정보
        DISABLED_CATEGORIES: 'vocabmaster_disabled_categories' // 비활성 카테고리
    },

    // ========================================================================
    // 학습 진도 데이터
    // 형식: { wordId: 'new' | 'learning' | 'memorized' }
    // ========================================================================
    progress: {},

    // ========================================================================
    // 사용자 설정 (기본값)
    // loadSettings()에서 저장된 값과 머지됨
    // ========================================================================
    settings: {
        darkMode: false,              // 다크 모드 활성화 여부
        showPronunciation: true,      // 발음 기호 표시 여부
        displayMode: 'paging',        // 단어 목록 표시 방식: 'all' (전체) / 'paging' (페이징)
        itemsPerPage: 20,             // 페이지당 단어 수
        backupReminder: {
            enabled: true,            // 백업 알림 활성화
            frequency: 7              // 알림 주기 (일): 0, 1, 3, 7, 14, 30
        },
        // ====================================================================
        // 개발자 디버그 모드 설정
        // ====================================================================
        debugMode: {
            enabled: false,           // 디버그 모드 활성화 여부
            showTestPage: false,      // 테스트 페이지 링크 표시
            showArchitecturePage: false // 시스템 구성 페이지 링크 표시
        },
        // 각 학습 모드별 UI 설정
        ui: {
            wordList: {
                statusFilter: 'all',  // 상태 필터: 'all', 'new', 'learning', 'memorized'
                viewMode: 'full'      // 보기 모드: 'full', 'compact'
            },
            flashcard: {
                statusFilter: 'all',
                autoTTS: false        // 카드 넘길 때 자동 음성 읽기
            },
            blink: {
                statusFilter: 'all',
                speed: '2000',        // 표시 속도 (밀리초)
                displayMode: 'both',  // 'word', 'meaning', 'both'
                repeatCount: '2',     // 반복 횟수
                autoTTS: true
            },
            quiz: {
                statusFilter: 'all',
                count: '20',          // 문제 수
                type: 'meaning'       // 퀴즈 유형: 'meaning', 'word', 'mixed'
            }
        }
    },

    // ========================================================================
    // 백업 정보
    // 백업 알림에 사용됨
    // ========================================================================
    backupInfo: {
        lastBackupDate: null,         // 마지막 백업 날짜
        lastDataModifiedDate: null    // 마지막 데이터 수정 날짜
    },

    // ========================================================================
    // 학습 통계
    // ========================================================================
    stats: {
        totalStudied: 0,              // 총 학습한 단어 수
        totalMemorized: 0,            // 암기 완료한 단어 수
        streakDays: 0,                // 연속 학습 일수
        lastStudyDate: null,          // 마지막 학습 날짜
        studyHistory: []              // 최근 30일 학습 기록 [{date, words}]
    },

    // ========================================================================
    // 사용자 정의 카테고리
    // 형식: [{ id, name, icon, color, words: [...] }]
    // ========================================================================
    customCategories: [],

    // ========================================================================
    // 비활성화된 카테고리 ID 목록
    // '전체' 선택 시 해당 카테고리 제외
    // ========================================================================
    disabledCategories: [],

    // ========================================================================
    // 초기화 완료 플래그
    // init() 완료 전 save 호출을 방지하기 위해 사용
    // ========================================================================
    initialized: false,

    // ========================================================================
    // 각 데이터 타입의 로드 상태
    //
    // [상태 설명]
    // - 'empty'     : localStorage에 데이터가 없음 (처음 접속)
    //                 → 정상적으로 저장 가능
    // - 'loaded'    : localStorage에서 데이터 로드 성공
    //                 → 정상적으로 저장 가능
    // - 'corrupted' : localStorage에 데이터가 있지만 파싱 실패 (손상됨)
    //                 → sessionStorage에 임시 저장 (기존 데이터 보호)
    //
    // [중요]
    // 이 메커니즘은 로드 실패 시 빈 데이터가 기존 데이터를 덮어쓰는 것을 방지
    // ========================================================================
    _loadStatus: {
        progress: 'empty',
        settings: 'empty',
        stats: 'empty',
        customCategories: 'empty',
        disabledCategories: 'empty'
    },

    // ========================================================================
    // 임시 저장소 키 (sessionStorage용)
    // corrupted 상태에서 세션 동안의 데이터를 보존하기 위해 사용
    //
    // [한계점]
    // sessionStorage는 탭을 닫으면 데이터가 사라짐
    // 따라서 corrupted 상태에서 탭을 닫으면 세션 중 학습 데이터 손실
    // ========================================================================
    TEMP_KEYS: {
        PROGRESS: 'vocabmaster_temp_progress',
        STATS: 'vocabmaster_temp_stats',
        CUSTOM_CATEGORIES: 'vocabmaster_temp_custom_categories'
    },

    // ========================================================================
    // 백업 저장소 키 (localStorage용)
    // Write-Verify 패턴에서 성공한 데이터의 백업 보관
    //
    // [복구 우선순위]
    // 1순위: 메인 데이터 (KEYS.*)
    // 2순위: 백업 데이터 (BACKUP_KEYS.*)
    // 3순위: 임시 데이터 (TEMP_KEYS.* - sessionStorage)
    // 4순위: 복구 불가 → 사용자에게 선택 요청
    //
    // [백업 대상]
    // 중요 데이터만 백업 (progress, customCategories, stats)
    // settings는 재설정 가능하므로 백업하지 않음
    // ========================================================================
    BACKUP_KEYS: {
        PROGRESS: 'vocabmaster_progress_backup',
        STATS: 'vocabmaster_stats_backup',
        CUSTOM_CATEGORIES: 'vocabmaster_custom_categories_backup'
    },

    // ========================================================================
    // 기존 데이터 존재 여부 플래그
    // 신규 사용자와 데이터 손상 사용자 구분에 사용
    // ========================================================================
    _hadDataBefore: false,

    // ========================================================================
    // 복구 불가 상태 플래그
    // 모든 복구 시도 실패 시 true
    // ========================================================================
    _unrecoverable: false,

    // ========================================================================
    // 저장소 에러 알림 (디바운스 처리)
    // 연속적인 에러에 대해 5초당 한 번만 알림
    // ========================================================================
    _lastErrorTime: 0,

    /**
     * 저장소 에러 사용자 알림
     * @param {string} message - 표시할 에러 메시지
     */
    showStorageError(message) {
        const now = Date.now();
        // 디바운스: 5초 내 중복 알림 방지
        if (now - this._lastErrorTime < 5000) return;
        this._lastErrorTime = now;

        if (typeof showToast === 'function') {
            showToast(message + ' - 저장소 공간을 확인하세요');
        }
        console.error('Storage Error:', message);
    },

    // ========================================================================
    // 디버그 로깅 헬퍼
    // ========================================================================

    /**
     * 디버그 모드일 때만 토스트 알림 표시
     * @param {string} message - 표시할 메시지
     */
    debugLog(message) {
        console.log('[Storage Debug]', message);
        if (this.settings.debugMode?.enabled && typeof showToast === 'function') {
            showToast(`🔧 ${message}`, 3000);
        }
    },

    // ========================================================================
    // Write-Verify 패턴 및 백업/복구 함수
    // ========================================================================

    /**
     * 데이터를 안전하게 저장 (Write-Verify 패턴)
     *
     * [동작 순서]
     * 1. 새 데이터를 localStorage에 저장
     * 2. 저장된 데이터를 다시 읽어서 검증 (파싱 가능한지)
     * 3. 검증 성공 시 백업 갱신
     * 4. 검증 실패 시 백업에서 복구
     *
     * @param {string} mainKey - 메인 localStorage 키
     * @param {string} backupKey - 백업 localStorage 키
     * @param {any} data - 저장할 데이터
     * @returns {boolean} 저장 성공 여부
     */
    saveWithBackup(mainKey, backupKey, data) {
        const serialized = JSON.stringify(data);

        try {
            // 1. Write: 새 데이터 저장
            localStorage.setItem(mainKey, serialized);

            // 2. Verify: 저장된 데이터 검증
            const readBack = localStorage.getItem(mainKey);
            JSON.parse(readBack); // 파싱 가능한지 확인 (실패 시 throw)

            // 3. 검증 성공: 백업 갱신
            if (backupKey) {
                localStorage.setItem(backupKey, serialized);
            }

            return true;

        } catch (e) {
            console.error('[Storage] Write-Verify 실패:', mainKey, e);

            // 4. 검증 실패: 백업에서 복구 시도
            if (backupKey) {
                const restored = this.restoreFromBackup(mainKey, backupKey);
                if (restored) {
                    this.debugLog(`데이터 손상 감지, 백업에서 복구됨: ${mainKey}`);
                    return false;
                }
            }

            this.showStorageError('데이터 저장 실패');
            return false;
        }
    },

    /**
     * 백업에서 데이터 복구
     *
     * @param {string} mainKey - 복구할 메인 키
     * @param {string} backupKey - 백업 키
     * @returns {boolean} 복구 성공 여부
     */
    restoreFromBackup(mainKey, backupKey) {
        try {
            const backup = localStorage.getItem(backupKey);
            if (!backup) return false;

            // 백업 데이터 검증
            JSON.parse(backup);

            // 메인 키에 복구
            localStorage.setItem(mainKey, backup);
            this.debugLog(`백업에서 복구 완료: ${mainKey}`);
            return true;

        } catch (e) {
            console.error('[Storage] 백업 복구 실패:', mainKey, e);
            return false;
        }
    },

    /**
     * 복구 우선순위에 따라 데이터 로드
     *
     * [복구 우선순위]
     * 1순위: 메인 데이터 (localStorage mainKey)
     * 2순위: 백업 데이터 (localStorage backupKey)
     * 3순위: 임시 데이터 (sessionStorage tempKey)
     * 4순위: null (복구 불가)
     *
     * @param {string} mainKey - 메인 localStorage 키
     * @param {string} backupKey - 백업 localStorage 키
     * @param {string} tempKey - 임시 sessionStorage 키
     * @returns {Object} { data, source: 'main'|'backup'|'temp'|'none', hadData: boolean }
     */
    loadWithRecovery(mainKey, backupKey, tempKey) {
        // 데이터 존재 여부 체크 (신규 사용자 구분용)
        const mainRaw = localStorage.getItem(mainKey);
        const backupRaw = backupKey ? localStorage.getItem(backupKey) : null;
        const tempRaw = tempKey ? sessionStorage.getItem(tempKey) : null;

        const hadData = !!(mainRaw || backupRaw || tempRaw);

        // 1순위: 메인 데이터
        if (mainRaw) {
            try {
                const parsed = JSON.parse(mainRaw);
                return { data: parsed, source: 'main', hadData };
            } catch (e) {
                console.warn('[Storage] 메인 데이터 손상:', mainKey);
            }
        }

        // 2순위: 백업 데이터
        if (backupRaw) {
            try {
                const parsed = JSON.parse(backupRaw);
                // 백업에서 복구 성공 시 메인에도 복원
                localStorage.setItem(mainKey, backupRaw);
                this.debugLog(`백업에서 자동 복구: ${mainKey}`);
                return { data: parsed, source: 'backup', hadData };
            } catch (e) {
                console.warn('[Storage] 백업 데이터도 손상:', backupKey);
            }
        }

        // 3순위: 임시 데이터 (sessionStorage)
        if (tempRaw) {
            try {
                const parsed = JSON.parse(tempRaw);
                // 임시 데이터로 메인 복원
                localStorage.setItem(mainKey, tempRaw);
                if (backupKey) {
                    localStorage.setItem(backupKey, tempRaw);
                }
                this.debugLog(`임시 저장소에서 복구: ${mainKey}`);
                return { data: parsed, source: 'temp', hadData };
            } catch (e) {
                console.warn('[Storage] 임시 데이터도 손상:', tempKey);
            }
        }

        // 4순위: 복구 불가
        return { data: null, source: 'none', hadData };
    },

    /**
     * 복구 불가 시 사용자 선택 모달 표시
     * 기존 데이터가 있었는데 모두 손상된 경우만 표시
     */
    showRecoveryModal() {
        // 모달이 이미 있으면 표시하지 않음
        if (document.getElementById('recovery-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'recovery-modal';
        modal.className = 'modal-overlay';
        modal.style.cssText = 'display:flex; z-index:10000;';
        modal.innerHTML = `
            <div class="modal" style="max-width: 400px;">
                <div class="modal-header">
                    <h3>⚠️ 데이터 복구 불가</h3>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 16px; color: var(--text-secondary);">
                        저장된 학습 데이터가 손상되어 복구할 수 없습니다.
                    </p>
                    <p style="margin-bottom: 16px;">
                        다음 중 하나를 선택해 주세요:
                    </p>
                    <div style="background: var(--card-bg); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
                        <strong>📥 학습 데이터 가져오기</strong>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
                            이전에 백업한 JSON 파일이 있다면 선택하세요.
                            백업 파일의 데이터로 복원됩니다.
                        </p>
                    </div>
                    <div style="background: var(--card-bg); padding: 12px; border-radius: 8px;">
                        <strong>🔄 초기 상태로 진행</strong>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
                            처음부터 새로 시작합니다.
                            나중에 설정 > 학습 데이터 가져오기로 복구할 수 있습니다.
                        </p>
                    </div>
                </div>
                <div class="modal-footer" style="display: flex; gap: 8px;">
                    <button id="recovery-import-btn" class="btn btn-primary" style="flex: 1;">
                        📥 데이터 가져오기
                    </button>
                    <button id="recovery-continue-btn" class="btn btn-secondary" style="flex: 1;">
                        🔄 초기 상태로 진행
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 데이터 가져오기 버튼
        document.getElementById('recovery-import-btn').addEventListener('click', () => {
            // 파일 선택 input 생성
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const result = this.importData(event.target.result);
                        if (result && result.success) {
                            modal.remove();
                            this._unrecoverable = false;
                            if (typeof showToast === 'function') {
                                showToast('✅ 데이터 복구 완료!', 3000);
                            }
                            // 페이지 새로고침으로 데이터 적용
                            setTimeout(() => location.reload(), 1000);
                        } else {
                            if (typeof showToast === 'function') {
                                showToast('❌ 파일 형식이 올바르지 않습니다', 3000);
                            }
                        }
                    };
                    reader.readAsText(file);
                }
            };
            fileInput.click();
        });

        // 초기 상태로 진행 버튼
        document.getElementById('recovery-continue-btn').addEventListener('click', () => {
            if (confirm('정말 초기 상태로 진행하시겠습니까?\n\n기존 학습 데이터는 복구되지 않습니다.')) {
                modal.remove();
                this._unrecoverable = false;
                // 손상된 데이터 정리
                this.clearCorruptedData();
                if (typeof showToast === 'function') {
                    showToast('초기 상태로 시작합니다. 설정 > 학습 데이터 가져오기로 복구할 수 있습니다.', 5000);
                }
            }
        });

        // 모달 외부 클릭 및 ESC 키로 닫기 방지 (선택 필수)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (typeof showToast === 'function') {
                    showToast('데이터 복구 방법을 선택해 주세요', 2000);
                }
            }
        });
    },

    /**
     * 손상된 데이터 정리 (초기 상태로 진행 시)
     */
    clearCorruptedData() {
        // 모든 관련 키 삭제
        Object.values(this.KEYS).forEach(key => {
            try { localStorage.removeItem(key); } catch (e) { }
        });
        Object.values(this.BACKUP_KEYS).forEach(key => {
            try { localStorage.removeItem(key); } catch (e) { }
        });
        Object.values(this.TEMP_KEYS).forEach(key => {
            try { sessionStorage.removeItem(key); } catch (e) { }
        });

        // 메모리 데이터 초기화
        this.progress = {};
        this.stats = {
            totalStudied: 0,
            totalMemorized: 0,
            streakDays: 0,
            lastStudyDate: null,
            studyHistory: []
        };
        this.customCategories = [];
        this.disabledCategories = [];

        // 로드 상태 초기화
        this._loadStatus = {
            progress: 'empty',
            settings: 'empty',
            stats: 'empty',
            customCategories: 'empty',
            disabledCategories: 'empty'
        };
    },

    // ========================================================================
    // 초기화 함수
    // ========================================================================

    /**
     * Storage 모듈 초기화
     *
     * [호출 시점]
     * data.js의 DOMContentLoaded 이벤트에서 자동 호출됨
     *
     * [초기화 순서]
     * 1. loadSettings: 설정 먼저 로드 (디버그 모드 확인용)
     * 2. loadWithRecovery: 복구 우선순위에 따라 중요 데이터 로드
     * 3. migrateWordsToNewFormat: 구버전 데이터 마이그레이션
     * 4. applySettings: 설정 적용 (다크모드 등)
     * 5. checkAndWarnCorruptedData: 손상된 데이터 경고 또는 복구 모달
     *
     * [복구 우선순위]
     * 메인 → 백업 → 임시(sessionStorage) → 복구 불가 모달
     *
     * [중요]
     * - init() 완료 전에는 save 함수가 동작하지 않음 (initialized 플래그)
     * - 중복 호출 방지: 이미 초기화된 경우 즉시 반환
     */
    init() {
        // 중복 초기화 방지
        if (this.initialized) return;

        // 1. 설정 먼저 로드 (디버그 모드 설정 확인용)
        this.loadSettings();
        this.loadBackupInfo();
        this.loadDisabledCategories();

        // 2. 복구 우선순위에 따라 중요 데이터 로드
        const progressResult = this.loadWithRecovery(
            this.KEYS.PROGRESS,
            this.BACKUP_KEYS.PROGRESS,
            this.TEMP_KEYS.PROGRESS
        );
        const statsResult = this.loadWithRecovery(
            this.KEYS.STATS,
            this.BACKUP_KEYS.STATS,
            this.TEMP_KEYS.STATS
        );
        const categoriesResult = this.loadWithRecovery(
            this.KEYS.CUSTOM_CATEGORIES,
            this.BACKUP_KEYS.CUSTOM_CATEGORIES,
            this.TEMP_KEYS.CUSTOM_CATEGORIES
        );

        // 기존 데이터 존재 여부 기록
        this._hadDataBefore = progressResult.hadData || statsResult.hadData || categoriesResult.hadData;

        // 로드 결과 적용
        if (progressResult.data) {
            this.progress = progressResult.data;
            this._loadStatus.progress = progressResult.source === 'main' ? 'loaded' : 'recovered';
        } else if (progressResult.hadData) {
            this._loadStatus.progress = 'corrupted';
        }

        if (statsResult.data && typeof statsResult.data === 'object') {
            this.stats = { ...this.stats, ...statsResult.data };
            this._loadStatus.stats = statsResult.source === 'main' ? 'loaded' : 'recovered';
        } else if (statsResult.hadData) {
            this._loadStatus.stats = 'corrupted';
        }

        if (categoriesResult.data && Array.isArray(categoriesResult.data)) {
            this.customCategories = categoriesResult.data;
            this._loadStatus.customCategories = categoriesResult.source === 'main' ? 'loaded' : 'recovered';
        } else if (categoriesResult.hadData) {
            this._loadStatus.customCategories = 'corrupted';
        }

        // 복구 불가 상태 확인 (데이터가 있었는데 모두 손상)
        const allCorrupted = this._hadDataBefore &&
            !progressResult.data &&
            !statsResult.data &&
            !categoriesResult.data;

        if (allCorrupted) {
            this._unrecoverable = true;
        }

        // 3. 구버전 단어 형식 마이그레이션 (meaning → meanings 배열)
        this.migrateWordsToNewFormat();

        // 4. 설정 적용 (다크모드 등)
        this.applySettings();

        // 5. 초기화 완료 표시 (이제부터 save 가능)
        this.initialized = true;

        // 6. 복구 불가 시 모달 표시, 아니면 경고
        this.checkAndWarnCorruptedData();

        // 7. sessionStorage 임시 데이터 정리 (복구 완료 후)
        this.clearTempData();
    },

    /**
     * sessionStorage 임시 데이터 정리
     */
    clearTempData() {
        Object.values(this.TEMP_KEYS).forEach(key => {
            try { sessionStorage.removeItem(key); } catch (e) { }
        });
    },

    /**
     * 이전 세션의 임시 데이터 복구
     *
     * [시나리오]
     * 1. 이전 세션에서 localStorage가 corrupted 상태였음
     * 2. 사용자가 학습을 진행하여 sessionStorage에 임시 저장됨
     * 3. 사용자가 탭을 닫지 않고 새로고침 (sessionStorage 유지)
     * 4. 새 세션에서 localStorage가 정상이면 temp 데이터를 머지
     *
     * [한계점]
     * - sessionStorage는 탭/창을 닫으면 사라짐
     * - 따라서 corrupted 상태에서 탭을 닫으면 세션 데이터 손실
     * - 이를 방지하려면 IndexedDB 사용 필요 (향후 개선 사항)
     */
    recoverTempData() {
        try {
            const tempProgress = sessionStorage.getItem(this.TEMP_KEYS.PROGRESS);
            const tempStats = sessionStorage.getItem(this.TEMP_KEYS.STATS);
            const tempCategories = sessionStorage.getItem(this.TEMP_KEYS.CUSTOM_CATEGORIES);

            if (!tempProgress && !tempStats && !tempCategories) {
                return; // 복구할 임시 데이터 없음
            }

            console.log('[Storage] 이전 세션의 임시 데이터 발견, 복구 시도...');

            // Progress 복구: 머지 방식 (높은 상태 유지)
            if (tempProgress) {
                try {
                    const tempData = JSON.parse(tempProgress);
                    const currentRaw = localStorage.getItem(this.KEYS.PROGRESS);

                    if (!currentRaw) {
                        // localStorage가 비어있으면 그대로 복원
                        localStorage.setItem(this.KEYS.PROGRESS, tempProgress);
                        console.log('[Storage] Progress 복원 완료 (빈 저장소)');
                    } else {
                        // localStorage에 데이터가 있으면 머지 시도
                        try {
                            const currentData = JSON.parse(currentRaw);
                            const merged = this._mergeProgress(currentData, tempData);
                            localStorage.setItem(this.KEYS.PROGRESS, JSON.stringify(merged));
                            console.log('[Storage] Progress 머지 완료');
                        } catch (parseError) {
                            // 기존 데이터 파싱 실패 시 temp 데이터로 덮어쓰기
                            localStorage.setItem(this.KEYS.PROGRESS, tempProgress);
                            console.log('[Storage] Progress 복원 완료 (기존 데이터 손상)');
                        }
                    }
                } catch (e) {
                    console.error('[Storage] Progress 복구 실패:', e);
                }
            }

            // Custom Categories 복구
            if (tempCategories) {
                try {
                    const currentRaw = localStorage.getItem(this.KEYS.CUSTOM_CATEGORIES);
                    if (!currentRaw) {
                        localStorage.setItem(this.KEYS.CUSTOM_CATEGORIES, tempCategories);
                        console.log('[Storage] Custom Categories 복원 완료');
                    }
                    // 이미 데이터가 있으면 덮어쓰지 않음 (사용자 데이터 보호)
                } catch (e) {
                    console.error('[Storage] Custom Categories 복구 실패:', e);
                }
            }

            // 복구 완료 후 임시 저장소 정리
            sessionStorage.removeItem(this.TEMP_KEYS.PROGRESS);
            sessionStorage.removeItem(this.TEMP_KEYS.STATS);
            sessionStorage.removeItem(this.TEMP_KEYS.CUSTOM_CATEGORIES);

            console.log('[Storage] 임시 데이터 복구 완료');
        } catch (e) {
            console.error('[Storage] 임시 데이터 복구 중 오류:', e);
        }
    },

    /**
     * Progress 데이터 머지 (높은 상태 유지)
     * @param {Object} current - 현재 localStorage 데이터
     * @param {Object} temp - sessionStorage 임시 데이터
     * @returns {Object} 머지된 데이터
     */
    _mergeProgress(current, temp) {
        const statusPriority = { 'new': 0, 'learning': 1, 'memorized': 2 };
        const merged = { ...current };

        Object.entries(temp).forEach(([wordId, tempStatus]) => {
            const currentStatus = merged[wordId] || 'new';
            const currentPriority = statusPriority[currentStatus] || 0;
            const tempPriority = statusPriority[tempStatus] || 0;

            // 더 높은 상태 유지
            if (tempPriority > currentPriority) {
                merged[wordId] = tempStatus;
            }
        });

        return merged;
    },

    /**
     * 손상된 데이터 감지 및 사용자 경고
     *
     * [동작]
     * 1. 복구 불가 상태 (_unrecoverable)면 필수 모달 표시
     * 2. 일부 손상이면 토스트로 경고 (디버그 모드 무관)
     * 3. 백업에서 자동 복구된 경우 디버그 모드일 때만 알림
     *
     * [호출 시점]
     * - init() 완료 후 호출
     * - UI 준비를 위해 1초 지연 후 표시
     */
    checkAndWarnCorruptedData() {
        // 1. 복구 불가 상태면 필수 모달 표시 (디버그 모드 무관)
        if (this._unrecoverable) {
            setTimeout(() => {
                this.showRecoveryModal();
            }, 500);
            return;
        }

        // 복구된 항목 확인 (디버그 모드일 때만 알림)
        const recovered = [];
        if (this._loadStatus.progress === 'recovered') recovered.push('학습 진도');
        if (this._loadStatus.customCategories === 'recovered') recovered.push('사용자 카테고리');
        if (this._loadStatus.stats === 'recovered') recovered.push('학습 통계');

        if (recovered.length > 0 && this.settings.debugMode?.enabled) {
            setTimeout(() => {
                const message = `🔧 백업에서 자동 복구됨: ${recovered.join(', ')}`;
                if (typeof showToast === 'function') {
                    showToast(message, 4000);
                }
                console.log('[Storage Debug]', message);
            }, 1000);
        }

        // 2. 일부 손상된 항목 확인 (디버그 모드 무관)
        const corrupted = [];
        if (this._loadStatus.progress === 'corrupted') corrupted.push('학습 진도');
        if (this._loadStatus.customCategories === 'corrupted') corrupted.push('사용자 카테고리');
        if (this._loadStatus.stats === 'corrupted') corrupted.push('학습 통계');

        if (corrupted.length > 0) {
            // UI 준비를 위해 1초 지연 후 토스트 표시
            setTimeout(() => {
                const message = `⚠️ 일부 데이터 로드 실패: ${corrupted.join(', ')}. 백업 파일에서 복구하세요.`;
                if (typeof showToast === 'function') {
                    showToast(message, 5000);
                }
                console.error('손상된 데이터 감지:', corrupted);
            }, 1000);
        }
    },

    /**
     * 구버전 단어 형식을 신버전으로 마이그레이션
     *
     * [구버전 형식]
     * { word, meaning: "뜻1, 뜻2", partOfSpeech, examples: [...] }
     *
     * [신버전 형식]
     * { word, meanings: [{ meaning, partOfSpeech, examples }, ...] }
     *
     * [마이그레이션 규칙]
     * 1. meaning 문자열을 ','로 분리하여 각각 meanings 배열 요소로
     * 2. examples는 첫 번째 뜻에만 연결
     * 3. partOfSpeech는 각 뜻에 복사
     *
     * [호출 시점]
     * - init()에서 데이터 로드 후 호출
     * - 마이그레이션이 발생하면 자동 저장
     */
    migrateWordsToNewFormat() {
        let migrated = false;
        this.customCategories.forEach(category => {
            if (category.words) {
                category.words.forEach(word => {
                    // 마이그레이션 필요 여부 확인 (meaning 있고 meanings 없음)
                    if (word.meaning && (!word.meanings || word.meanings.length === 0)) {
                        // 구형식 → 신형식 변환
                        const meanings = [];
                        const meaningStrings = word.meaning.split(',').map(m => m.trim()).filter(m => m);

                        meaningStrings.forEach((m, index) => {
                            const meaningObj = {
                                meaning: m,
                                partOfSpeech: word.partOfSpeech || ''
                            };
                            // 예문은 첫 번째 뜻에만 연결
                            if (index === 0 && word.examples && word.examples.length > 0) {
                                meaningObj.examples = word.examples;
                            }
                            meanings.push(meaningObj);
                        });

                        word.meanings = meanings;
                        migrated = true;
                    }
                });
            }
        });

        if (migrated) {
            this.saveCustomCategories();
            console.log('단어 형식 마이그레이션 완료');
        }
    },

    // ========================================================================
    // Progress (학습 진도) 관련 함수
    // ========================================================================

    /**
     * localStorage에서 학습 진도 로드
     *
     * [데이터 형식]
     * { wordId: 'new' | 'learning' | 'memorized' }
     *
     * [로드 결과에 따른 _loadStatus 설정]
     * - 데이터 없음    → 'empty' (첫 방문)
     * - 파싱 성공      → 'loaded' (정상)
     * - 파싱 실패      → 'corrupted' (손상)
     */
    loadProgress() {
        try {
            const data = localStorage.getItem(this.KEYS.PROGRESS);
            if (data) {
                const parsed = JSON.parse(data);
                // 데이터 유효성 검사 후 할당
                if (parsed && typeof parsed === 'object') {
                    this.progress = parsed;
                    this._loadStatus.progress = 'loaded';
                }
            } else {
                // 데이터 없음 - 첫 방문
                this._loadStatus.progress = 'empty';
            }
        } catch (e) {
            console.error('Progress 로드 에러:', e);
            // 데이터는 있지만 손상됨 - 임시 저장소에 저장할 예정
            this._loadStatus.progress = 'corrupted';
        }
    },

    /**
     * 학습 진도를 localStorage에 저장 (Write-Verify 패턴)
     *
     * [저장 로직]
     * 1. 초기화 전이면 저장 안 함 (데이터 보호)
     * 2. 정상 상태면 Write-Verify 패턴으로 저장 + 백업 갱신
     * 3. 손상 상태면 sessionStorage에 임시 저장 (기존 데이터 보호)
     *
     * [Write-Verify 패턴]
     * - 저장 후 다시 읽어서 검증
     * - 검증 성공 시 백업 갱신
     * - 검증 실패 시 백업에서 자동 복구
     */
    saveProgress() {
        // 초기화 전 저장 방지
        if (!this.initialized) {
            console.warn('경고: 초기화 전 Progress 저장 시도');
            return;
        }

        const status = this._loadStatus.progress;

        // 정상/복구됨 상태: Write-Verify 패턴으로 저장
        if (status === 'empty' || status === 'loaded' || status === 'recovered') {
            const success = this.saveWithBackup(
                this.KEYS.PROGRESS,
                this.BACKUP_KEYS.PROGRESS,
                this.progress
            );
            if (success) {
                this._loadStatus.progress = 'loaded';
                this.markDataModified();  // 백업 알림용 수정 시간 기록
            }
            return;
        }

        // 손상 상태: sessionStorage에 임시 저장
        if (status === 'corrupted') {
            try {
                sessionStorage.setItem(this.TEMP_KEYS.PROGRESS, JSON.stringify(this.progress));
                console.log('Progress를 임시 저장소에 저장 (메인 저장소 손상)');
            } catch (e) {
                console.error('임시 저장소 저장 에러:', e);
            }
        }
    },

    // ========================================================================
    // Settings (사용자 설정) 관련 함수
    // ========================================================================

    /**
     * localStorage에서 사용자 설정 로드
     *
     * [특징]
     * - 깊은 병합 (Deep Merge) 사용
     * - 저장된 설정이 기본값을 덮어씀
     * - 누락된 설정은 기본값 유지
     *
     * [병합 대상 중첩 객체]
     * - backupReminder: 백업 알림 설정
     * - ui: 각 모드별 UI 설정 (wordList, flashcard, blink, quiz)
     */
    loadSettings() {
        try {
            const data = localStorage.getItem(this.KEYS.SETTINGS);
            if (data) {
                const saved = JSON.parse(data);
                // 중첩 객체에 대한 깊은 병합
                this.settings = {
                    ...this.settings,
                    ...saved,
                    backupReminder: {
                        ...this.settings.backupReminder,
                        ...(saved.backupReminder || {})
                    },
                    // 디버그 모드 설정 병합
                    debugMode: {
                        ...this.settings.debugMode,
                        ...(saved.debugMode || {})
                    },
                    ui: {
                        wordList: {
                            ...this.settings.ui.wordList,
                            ...(saved.ui?.wordList || {})
                        },
                        flashcard: {
                            ...this.settings.ui.flashcard,
                            ...(saved.ui?.flashcard || {})
                        },
                        blink: {
                            ...this.settings.ui.blink,
                            ...(saved.ui?.blink || {})
                        },
                        quiz: {
                            ...this.settings.ui.quiz,
                            ...(saved.ui?.quiz || {})
                        }
                    }
                };
                this._loadStatus.settings = 'loaded';
            } else {
                this._loadStatus.settings = 'empty';
            }
        } catch (e) {
            console.error('Settings 로드 에러:', e);
            this._loadStatus.settings = 'corrupted';
        }
    },

    /**
     * 사용자 설정을 localStorage에 저장
     *
     * [특징]
     * - 설정은 학습 데이터보다 덜 중요하므로 임시 저장 미적용
     * - corrupted 상태면 저장 건너뜀 (로그만 남김)
     */
    saveSettings() {
        if (!this.initialized) {
            console.warn('경고: 초기화 전 Settings 저장 시도');
            return;
        }
        const status = this._loadStatus.settings;
        if (status === 'empty' || status === 'loaded') {
            try {
                localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(this.settings));
                this._loadStatus.settings = 'loaded';
            } catch (e) {
                console.error('Settings 저장 에러:', e);
                this.showStorageError('설정 저장 실패');
            }
        }
        // 설정 손상은 치명적이지 않으므로 로그만 남김
        if (status === 'corrupted') {
            console.warn('Settings 저장 건너뜀 - 데이터 손상 상태');
        }
    },

    // ========================================================================
    // Stats (학습 통계) 관련 함수
    // ========================================================================

    /**
     * localStorage에서 학습 통계 로드
     *
     * [데이터 형식]
     * {
     *   totalStudied: number,      // 총 학습 단어 수
     *   totalMemorized: number,    // 암기 완료 단어 수
     *   streakDays: number,        // 연속 학습 일수
     *   lastStudyDate: string,     // 마지막 학습 날짜
     *   studyHistory: array        // 최근 30일 학습 기록
     * }
     */
    loadStats() {
        try {
            const data = localStorage.getItem(this.KEYS.STATS);
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed && typeof parsed === 'object') {
                    this.stats = { ...this.stats, ...parsed };
                    this._loadStatus.stats = 'loaded';
                }
            } else {
                this._loadStatus.stats = 'empty';
            }
        } catch (e) {
            console.error('Stats 로드 에러:', e);
            this._loadStatus.stats = 'corrupted';
        }
    },

    /**
     * 학습 통계를 localStorage에 저장 (Write-Verify 패턴)
     *
     * [특징]
     * - Progress와 마찬가지로 중요한 데이터이므로 백업 적용
     * - corrupted 상태면 sessionStorage에 임시 저장
     */
    saveStats() {
        if (!this.initialized) {
            console.warn('경고: 초기화 전 Stats 저장 시도');
            return;
        }

        const status = this._loadStatus.stats;

        // 정상/복구됨 상태: Write-Verify 패턴으로 저장
        if (status === 'empty' || status === 'loaded' || status === 'recovered') {
            const success = this.saveWithBackup(
                this.KEYS.STATS,
                this.BACKUP_KEYS.STATS,
                this.stats
            );
            if (success) {
                this._loadStatus.stats = 'loaded';
                this.markDataModified();
            }
            return;
        }

        // 손상 상태: 임시 저장소에 저장
        if (status === 'corrupted') {
            try {
                sessionStorage.setItem(this.TEMP_KEYS.STATS, JSON.stringify(this.stats));
                console.log('Stats를 임시 저장소에 저장 (메인 저장소 손상)');
            } catch (e) {
                console.error('임시 저장소 저장 에러:', e);
            }
        }
    },

    // ========================================================================
    // Custom Categories (사용자 정의 카테고리) 관련 함수
    // ========================================================================

    /**
     * localStorage에서 사용자 정의 카테고리 로드
     *
     * [데이터 형식]
     * [{ id, name, icon, color, isCustom, createdAt, words: [...] }, ...]
     *
     * [각 단어(word) 형식]
     * { id, word, pronunciation, partOfSpeech, meanings: [...], meaning }
     */
    loadCustomCategories() {
        try {
            const data = localStorage.getItem(this.KEYS.CUSTOM_CATEGORIES);
            if (data) {
                const parsed = JSON.parse(data);
                // 배열인지 유효성 검사
                if (Array.isArray(parsed)) {
                    this.customCategories = parsed;
                    this._loadStatus.customCategories = 'loaded';
                }
            } else {
                this._loadStatus.customCategories = 'empty';
            }
        } catch (e) {
            console.error('Custom Categories 로드 에러:', e);
            this._loadStatus.customCategories = 'corrupted';
        }
    },

    /**
     * 사용자 정의 카테고리를 localStorage에 저장 (Write-Verify 패턴)
     *
     * [특징]
     * - 사용자가 직접 입력한 데이터이므로 중요도 높음
     * - Write-Verify 패턴으로 안전하게 저장 + 백업
     * - corrupted 상태면 sessionStorage에 임시 저장
     */
    saveCustomCategories() {
        if (!this.initialized) {
            console.warn('경고: 초기화 전 Custom Categories 저장 시도');
            return;
        }

        const status = this._loadStatus.customCategories;

        // 정상/복구됨 상태: Write-Verify 패턴으로 저장
        if (status === 'empty' || status === 'loaded' || status === 'recovered') {
            const success = this.saveWithBackup(
                this.KEYS.CUSTOM_CATEGORIES,
                this.BACKUP_KEYS.CUSTOM_CATEGORIES,
                this.customCategories
            );
            if (success) {
                this._loadStatus.customCategories = 'loaded';
                this.markDataModified();
            }
            return;
        }

        // 손상 상태: 임시 저장소에 저장
        if (status === 'corrupted') {
            try {
                sessionStorage.setItem(this.TEMP_KEYS.CUSTOM_CATEGORIES, JSON.stringify(this.customCategories));
                console.log('Custom Categories를 임시 저장소에 저장 (메인 저장소 손상)');
            } catch (e) {
                console.error('임시 저장소 저장 에러:', e);
            }
        }
    },

    // ========================================================================
    // Backup Info (백업 정보) 관련 함수
    // ========================================================================

    /**
     * localStorage에서 백업 정보 로드
     * 백업 알림 표시 여부 결정에 사용
     */
    loadBackupInfo() {
        try {
            const data = localStorage.getItem(this.KEYS.BACKUP_INFO);
            if (data) {
                this.backupInfo = { ...this.backupInfo, ...JSON.parse(data) };
            }
        } catch (e) {
            console.error('Backup Info 로드 에러:', e);
        }
    },

    /**
     * 백업 정보를 localStorage에 저장
     * 데이터 보호 메커니즘 미적용 (메타 정보이므로)
     */
    saveBackupInfo() {
        try {
            localStorage.setItem(this.KEYS.BACKUP_INFO, JSON.stringify(this.backupInfo));
        } catch (e) {
            console.error('Backup Info 저장 에러:', e);
        }
    },

    /**
     * 데이터 수정 시간 기록
     * saveProgress, saveStats, saveCustomCategories에서 호출
     * 백업 알림 표시 여부 판단에 사용
     */
    markDataModified() {
        this.backupInfo.lastDataModifiedDate = new Date().toISOString();
        this.saveBackupInfo();
    },

    /**
     * 백업 완료 시간 기록
     * exportData() 성공 시 호출
     */
    recordBackup() {
        this.backupInfo.lastBackupDate = new Date().toISOString();
        this.saveBackupInfo();
    },

    /**
     * 백업 알림 표시 여부 확인
     *
     * [알림 표시 조건]
     * 1. backupReminder 설정이 활성화됨
     * 2. 데이터가 수정된 적이 있음
     * 3. 마지막 백업 이후 데이터가 수정됨
     * 4. 설정된 주기(일)가 경과함
     *
     * @returns {boolean} 알림 표시 여부
     */
    shouldShowBackupReminder() {
        const settings = this.settings.backupReminder || { enabled: true, frequency: 7 };

        // 비활성화 또는 주기 0이면 표시 안 함
        if (!settings.enabled || settings.frequency === 0) {
            return false;
        }

        // 데이터 수정된 적 없으면 표시 안 함
        if (!this.backupInfo.lastDataModifiedDate) {
            return false;
        }

        // 백업한 적 없으면 표시 (데이터는 있으나 백업 없음)
        if (!this.backupInfo.lastBackupDate) {
            return true;
        }

        // 마지막 백업 이후 수정된 적 없으면 표시 안 함
        const lastBackup = new Date(this.backupInfo.lastBackupDate);
        const lastModified = new Date(this.backupInfo.lastDataModifiedDate);

        if (lastModified <= lastBackup) {
            return false;
        }

        // 설정된 주기가 경과했는지 확인
        const now = new Date();
        const daysSinceBackup = Math.floor((now - lastBackup) / (1000 * 60 * 60 * 24));

        return daysSinceBackup >= settings.frequency;
    },

    // ========================================================================
    // Disabled Categories (비활성화된 카테고리) 관련 함수
    // ========================================================================

    /**
     * localStorage에서 비활성화된 카테고리 목록 로드
     *
     * [용도]
     * - '전체' 카테고리 선택 시 특정 카테고리 제외
     * - 사용자가 학습하지 않을 카테고리 관리
     */
    loadDisabledCategories() {
        try {
            const data = localStorage.getItem(this.KEYS.DISABLED_CATEGORIES);
            if (data) {
                const parsed = JSON.parse(data);
                // 배열인지 유효성 검사
                if (Array.isArray(parsed)) {
                    this.disabledCategories = parsed;
                    this._loadStatus.disabledCategories = 'loaded';
                }
            } else {
                this._loadStatus.disabledCategories = 'empty';
            }
        } catch (e) {
            console.error('Disabled Categories 로드 에러:', e);
            this._loadStatus.disabledCategories = 'corrupted';
        }
    },

    /**
     * 비활성화된 카테고리 목록을 localStorage에 저장
     * 덜 중요한 데이터이므로 임시 저장 미적용
     */
    saveDisabledCategories() {
        if (!this.initialized) {
            console.warn('경고: 초기화 전 Disabled Categories 저장 시도');
            return;
        }
        const status = this._loadStatus.disabledCategories;
        if (status === 'empty' || status === 'loaded') {
            try {
                localStorage.setItem(this.KEYS.DISABLED_CATEGORIES, JSON.stringify(this.disabledCategories));
                this._loadStatus.disabledCategories = 'loaded';
            } catch (e) {
                console.error('Disabled Categories 저장 에러:', e);
                this.showStorageError('비활성 카테고리 저장 실패');
            }
        }
        // 덜 중요하므로 로그만 남김
        if (status === 'corrupted') {
            console.warn('Disabled Categories 저장 건너뜀 - 데이터 손상 상태');
        }
    },

    /**
     * 카테고리가 비활성화되어 있는지 확인
     * @param {string} categoryId - 카테고리 ID
     * @returns {boolean} 비활성화 여부
     */
    isCategoryDisabled(categoryId) {
        return this.disabledCategories.includes(categoryId);
    },

    /**
     * 카테고리 활성화/비활성화 토글
     * @param {string} categoryId - 카테고리 ID
     * @returns {boolean} 토글 후 활성화 상태 (true=활성화됨)
     */
    toggleCategoryEnabled(categoryId) {
        const index = this.disabledCategories.indexOf(categoryId);
        if (index === -1) {
            // 현재 활성화 상태 → 비활성화
            this.disabledCategories.push(categoryId);
        } else {
            // 현재 비활성화 상태 → 활성화
            this.disabledCategories.splice(index, 1);
        }
        this.saveDisabledCategories();
        return !this.isCategoryDisabled(categoryId);
    },

    // ========================================================================
    // Custom Category CRUD 함수
    // ========================================================================

    /**
     * 사용자 카테고리 이름 중복 확인
     * @param {string} name - 확인할 이름
     * @param {string|null} excludeId - 제외할 카테고리 ID (수정 시 자기 자신 제외)
     * @returns {boolean} 중복 여부
     */
    customCategoryNameExists(name, excludeId = null) {
        return this.customCategories.some(c =>
            c.name.toLowerCase() === name.toLowerCase() && c.id !== excludeId
        );
    },

    /**
     * 새 사용자 카테고리 생성
     *
     * @param {string} name - 카테고리 이름
     * @param {string} icon - 아이콘 이모지 (기본값: 📁)
     * @param {string} color - 색상 코드 (기본값: #6c757d)
     * @returns {Object|null} 생성된 카테고리 또는 null (중복 시)
     */
    createCustomCategory(name, icon = '📁', color = '#6c757d') {
        // 이름 중복 확인
        if (this.customCategoryNameExists(name)) {
            return null;
        }

        const id = 'custom_' + Date.now();
        const category = {
            id,
            name,
            icon,
            color,
            isCustom: true,
            createdAt: new Date().toISOString(),
            words: []
        };
        this.customCategories.push(category);
        this.saveCustomCategories();
        return category;
    },

    /**
     * 사용자 카테고리 정보 수정
     * @param {string} categoryId - 카테고리 ID
     * @param {Object} updates - 수정할 필드 { name, icon, color }
     * @returns {Object|null} 수정된 카테고리 또는 null
     */
    updateCustomCategory(categoryId, updates) {
        const index = this.customCategories.findIndex(c => c.id === categoryId);
        if (index !== -1) {
            this.customCategories[index] = { ...this.customCategories[index], ...updates };
            this.saveCustomCategories();
            return this.customCategories[index];
        }
        return null;
    },

    /**
     * 사용자 카테고리 삭제
     * @param {string} categoryId - 카테고리 ID
     * @returns {boolean} 삭제 성공 여부
     */
    deleteCustomCategory(categoryId) {
        const index = this.customCategories.findIndex(c => c.id === categoryId);
        if (index !== -1) {
            this.customCategories.splice(index, 1);
            this.saveCustomCategories();
            return true;
        }
        return false;
    },

    /**
     * ID로 사용자 카테고리 조회
     * @param {string} categoryId - 카테고리 ID
     * @returns {Object|undefined} 카테고리 객체
     */
    getCustomCategory(categoryId) {
        return this.customCategories.find(c => c.id === categoryId);
    },

    // ========================================================================
    // 단어 관리 함수
    // ========================================================================

    /**
     * 사용자 카테고리에 단어 추가 (중복 처리 포함)
     *
     * [중복 처리 로직]
     * 1. 같은 단어가 이미 있으면 뜻을 머지
     * 2. 새로운 뜻만 추가 (기존 뜻과 중복되는 것은 제외)
     * 3. 새 뜻이 추가되면 학습 상태를 'new'로 리셋
     *
     * [지원 형식]
     * - 구형: { word, meaning, examples }
     * - 신형: { word, meanings: [...] }
     *
     * @param {string} categoryId - 카테고리 ID
     * @param {Object} word - 추가할 단어 데이터
     * @returns {Object|null} 결과 객체 (action: 'created'|'updated'|'polysemy_added')
     */
    addWordToCustomCategory(categoryId, word) {
        const category = this.getCustomCategory(categoryId);
        if (!category) return null;

        // 입력을 meanings 배열 형식으로 정규화
        let inputMeanings = this.normalizeToMeaningsArray(word);

        // 동일 단어 존재 여부 확인 (대소문자 무시)
        const existingWord = category.words.find(w =>
            w.word.toLowerCase() === word.word.toLowerCase()
        );

        if (existingWord) {
            // 기존 단어 있음 - 뜻 머지
            const existingMeaningsArray = existingWord.meanings || this.convertOldFormatToMeanings(existingWord);
            const mergedMeanings = [...existingMeaningsArray];
            const addedMeanings = [];

            inputMeanings.forEach(newMeaning => {
                // 이미 있는 뜻인지 확인
                const exists = mergedMeanings.some(m =>
                    m.meaning.toLowerCase() === newMeaning.meaning.toLowerCase()
                );
                if (!exists) {
                    mergedMeanings.push(newMeaning);
                    addedMeanings.push(newMeaning);
                }
            });

            // 단어 데이터 업데이트
            existingWord.pronunciation = word.pronunciation || existingWord.pronunciation;
            existingWord.partOfSpeech = word.partOfSpeech || existingWord.partOfSpeech || '';
            existingWord.meanings = mergedMeanings;
            existingWord.meaning = mergedMeanings.map(m => m.meaning).join(', ');
            existingWord.updatedAt = new Date().toISOString();
            // 구버전 examples 필드 제거 (이제 meanings 내에 포함)
            delete existingWord.examples;

            if (addedMeanings.length > 0) {
                // 새 뜻이 추가되면 학습 상태 리셋
                this.setWordStatus(existingWord.id, 'new');
                this.saveCustomCategories();
                return { ...existingWord, action: 'polysemy_added', addedMeanings };
            } else {
                this.saveCustomCategories();
                return { ...existingWord, action: 'updated' };
            }
        } else {
            // 새 단어 생성
            const wordId = 'custom_word_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const newWord = {
                id: wordId,
                word: word.word,
                pronunciation: word.pronunciation || '',
                partOfSpeech: word.partOfSpeech || '',
                meanings: inputMeanings,
                meaning: inputMeanings.map(m => m.meaning).join(', '),
                createdAt: new Date().toISOString()
            };
            category.words.push(newWord);
            this.saveCustomCategories();
            return { ...newWord, action: 'created' };
        }
    },

    /**
     * 입력 데이터를 meanings 배열 형식으로 정규화
     *
     * [변환 규칙]
     * 1. 이미 meanings 배열이 있으면 그대로 반환
     * 2. meaning 문자열이 있으면 ','로 분리하여 배열로 변환
     * 3. examples는 첫 번째 뜻에만 연결
     *
     * @param {Object} word - 원본 단어 데이터
     * @returns {Array} meanings 배열
     */
    normalizeToMeaningsArray(word) {
        // 이미 meanings 배열이 있으면 그대로 사용
        if (word.meanings && Array.isArray(word.meanings) && word.meanings.length > 0) {
            return word.meanings;
        }
        // 구형식(meaning 문자열 + examples)을 meanings 배열로 변환
        const meanings = [];
        if (word.meaning) {
            // 쉼표로 분리하여 각각 별도 뜻으로
            const meaningStrings = word.meaning.split(',').map(m => m.trim()).filter(m => m);
            meaningStrings.forEach((m, index) => {
                const meaningObj = { meaning: m };
                // 구형식에서 examples는 첫 번째 뜻에만 연결
                if (index === 0 && word.examples && word.examples.length > 0) {
                    meaningObj.examples = word.examples;
                }
                meanings.push(meaningObj);
            });
        }
        return meanings;
    },

    /**
     * 구형식 단어를 meanings 배열로 변환
     * (normalizeToMeaningsArray와 유사하나 기존 단어 객체 변환에 사용)
     *
     * @param {Object} word - 구형식 단어 객체
     * @returns {Array} meanings 배열
     */
    convertOldFormatToMeanings(word) {
        if (word.meanings && Array.isArray(word.meanings)) {
            return word.meanings;
        }
        const meanings = [];
        if (word.meaning) {
            const meaningStrings = word.meaning.split(',').map(m => m.trim()).filter(m => m);
            meaningStrings.forEach((m, index) => {
                const meaningObj = { meaning: m };
                if (index === 0 && word.examples && word.examples.length > 0) {
                    meaningObj.examples = word.examples;
                }
                meanings.push(meaningObj);
            });
        }
        return meanings;
    },

    /**
     * 사용자 카테고리 내 단어 수정
     *
     * @param {string} categoryId - 카테고리 ID
     * @param {string} wordId - 단어 ID
     * @param {Object} updates - 수정할 필드 { word, pronunciation, meanings }
     * @returns {Object|null} 수정된 단어 또는 null
     */
    updateWordInCustomCategory(categoryId, wordId, updates) {
        const category = this.getCustomCategory(categoryId);
        if (category) {
            const wordIndex = category.words.findIndex(w => w.id === wordId);
            if (wordIndex !== -1) {
                const existingWord = category.words[wordIndex];

                // 단어 데이터 업데이트
                existingWord.word = updates.word || existingWord.word;
                existingWord.pronunciation = updates.pronunciation !== undefined ? updates.pronunciation : existingWord.pronunciation;

                // meanings가 제공되면 업데이트
                if (updates.meanings) {
                    existingWord.meanings = updates.meanings;
                    existingWord.meaning = updates.meanings.map(m => m.meaning).join(', ');
                    // 구버전 examples 필드 정리
                    delete existingWord.examples;
                }

                existingWord.updatedAt = new Date().toISOString();

                this.saveCustomCategories();
                return existingWord;
            }
        }
        return null;
    },

    /**
     * 사용자 카테고리에서 단어 삭제
     *
     * @param {string} categoryId - 카테고리 ID
     * @param {string} wordId - 단어 ID
     * @returns {boolean} 삭제 성공 여부
     */
    deleteWordFromCustomCategory(categoryId, wordId) {
        const category = this.getCustomCategory(categoryId);
        if (category) {
            const wordIndex = category.words.findIndex(w => w.id === wordId);
            if (wordIndex !== -1) {
                category.words.splice(wordIndex, 1);
                this.saveCustomCategories();
                return true;
            }
        }
        return false;
    },

    // ========================================================================
    // 파일 Import 함수
    // ========================================================================

    /**
     * JSON 파일에서 단어 가져오기
     *
     * [지원 형식]
     * 1. 배열: [{ word, meaning|meanings, ... }, ...]
     * 2. 객체: { words: [...] }
     *
     * [각 단어 지원 필드]
     * - word: 영단어 (필수)
     * - meaning: 뜻 문자열 (구형식)
     * - meanings: 뜻 배열 (신형식)
     * - pronunciation: 발음
     * - partOfSpeech: 품사
     * - examples: 예문 배열
     *
     * @param {string} categoryId - 대상 카테고리 ID
     * @param {string|Object} jsonData - JSON 문자열 또는 객체
     * @returns {Object} { success, imported, created, updated, polysemy }
     */
    importWordsFromJSON(categoryId, jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            const words = Array.isArray(data) ? data : (data.words || []);
            const stats = { created: 0, updated: 0, polysemy: 0 };

            words.forEach(word => {
                // word 필드와 meanings 또는 meaning 중 하나 필수
                if (word.word && (word.meanings || word.meaning)) {
                    const wordData = {
                        word: word.word,
                        pronunciation: word.pronunciation || '',
                        partOfSpeech: word.partOfSpeech || ''
                    };

                    // 신형식 (meanings 배열)
                    if (word.meanings && Array.isArray(word.meanings)) {
                        wordData.meanings = word.meanings;
                    } else {
                        // 구형식 - meanings 배열로 변환
                        wordData.meaning = word.meaning;
                        wordData.examples = word.examples || (word.example ? [{
                            sentence: word.example,
                            translation: word.translation || ''
                        }] : []);
                    }

                    const result = this.addWordToCustomCategory(categoryId, wordData);
                    if (result) {
                        if (result.action === 'created') stats.created++;
                        else if (result.action === 'updated') stats.updated++;
                        else if (result.action === 'polysemy_added') stats.polysemy++;
                    }
                }
            });

            const total = stats.created + stats.updated + stats.polysemy;
            return { success: true, imported: total, ...stats };
        } catch (e) {
            console.error('JSON Import 에러:', e);
            return { success: false, error: e.message };
        }
    },

    /**
     * CSV 파일에서 단어 가져오기
     *
     * [형식]
     * word,pronunciation,partOfSpeech,meaning,example,translation
     *
     * [특징]
     * - 첫 줄이 헤더면 자동 건너뜀 ('word' 포함 여부로 판단)
     * - 따옴표 내 쉼표 처리 지원
     *
     * @param {string} categoryId - 대상 카테고리 ID
     * @param {string} csvData - CSV 문자열
     * @returns {Object} { success, imported, created, updated, polysemy }
     */
    importWordsFromCSV(categoryId, csvData) {
        try {
            const lines = csvData.trim().split('\n');
            const stats = { created: 0, updated: 0, polysemy: 0 };
            // 헤더 행 존재 시 건너뛰기
            const startIndex = lines[0].toLowerCase().includes('word') ? 1 : 0;

            for (let i = startIndex; i < lines.length; i++) {
                const parts = this.parseCSVLine(lines[i]);
                if (parts.length >= 2) {
                    const result = this.addWordToCustomCategory(categoryId, {
                        word: parts[0].trim(),
                        pronunciation: parts[1]?.trim() || '',
                        partOfSpeech: parts[2]?.trim() || '',
                        meaning: parts[3]?.trim() || parts[2]?.trim() || parts[1]?.trim() || '',
                        examples: parts[4] ? [{
                            sentence: parts[4].trim(),
                            translation: parts[5]?.trim() || ''
                        }] : []
                    });
                    if (result) {
                        if (result.action === 'created') stats.created++;
                        else if (result.action === 'updated') stats.updated++;
                        else if (result.action === 'polysemy_added') stats.polysemy++;
                    }
                }
            }

            const total = stats.created + stats.updated + stats.polysemy;
            return { success: true, imported: total, ...stats };
        } catch (e) {
            console.error('CSV Import 에러:', e);
            return { success: false, error: e.message };
        }
    },

    /**
     * CSV 한 줄 파싱 (따옴표 처리)
     * 쉼표가 따옴표 안에 있으면 필드 구분자로 처리하지 않음
     *
     * @param {string} line - CSV 한 줄
     * @returns {Array} 파싱된 필드 배열
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    },

    // ========================================================================
    // UI 적용 및 학습 상태 관리 함수
    // ========================================================================

    /**
     * 저장된 설정을 UI에 적용
     * init() 완료 후 호출되어 다크모드, 발음 표시 등 반영
     */
    applySettings() {
        // 다크 모드 적용
        if (this.settings.darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            const toggle = document.getElementById('dark-mode-toggle');
            if (toggle) toggle.checked = true;
        }

        // 발음 표시 설정 적용
        const pronToggle = document.getElementById('pronunciation-toggle');
        if (pronToggle) pronToggle.checked = this.settings.showPronunciation;
    },

    /**
     * 단어의 학습 상태 조회
     * @param {string} wordId - 단어 ID
     * @returns {string} 'new' | 'learning' | 'memorized'
     */
    getWordStatus(wordId) {
        return this.progress[wordId] || 'new';
    },

    /**
     * 단어의 학습 상태 설정
     *
     * [부수 효과]
     * - progress 객체 업데이트 및 저장
     * - memorized 상태 변경 시 stats.totalMemorized 업데이트
     *
     * @param {string} wordId - 단어 ID
     * @param {string} status - 'new' | 'learning' | 'memorized'
     */
    setWordStatus(wordId, status) {
        const oldStatus = this.progress[wordId];
        this.progress[wordId] = status;
        this.saveProgress();

        // 통계 업데이트: memorized 상태 변경 추적
        if (status === 'memorized' && oldStatus !== 'memorized') {
            this.stats.totalMemorized++;
            this.saveStats();
        } else if (oldStatus === 'memorized' && status !== 'memorized') {
            this.stats.totalMemorized = Math.max(0, this.stats.totalMemorized - 1);
            this.saveStats();
        }
    },

    /**
     * 단어를 암기 완료 상태로 설정
     * @param {string} wordId - 단어 ID
     */
    markMemorized(wordId) {
        this.setWordStatus(wordId, 'memorized');
    },

    /**
     * 단어를 학습 중 상태로 설정
     * @param {string} wordId - 단어 ID
     */
    markLearning(wordId) {
        this.setWordStatus(wordId, 'learning');
    },

    /**
     * 단어를 새 단어 상태로 리셋
     * @param {string} wordId - 단어 ID
     */
    markNew(wordId) {
        this.setWordStatus(wordId, 'new');
    },

    /**
     * 단어 상태 순환 토글
     * new → learning → memorized → new ...
     *
     * @param {string} wordId - 단어 ID
     * @returns {string} 변경된 상태
     */
    toggleStatus(wordId) {
        const current = this.getWordStatus(wordId);
        const statusCycle = ['new', 'learning', 'memorized'];
        const currentIndex = statusCycle.indexOf(current);
        const nextIndex = (currentIndex + 1) % statusCycle.length;
        this.setWordStatus(wordId, statusCycle[nextIndex]);
        return statusCycle[nextIndex];
    },

    // ========================================================================
    // 학습 진도 및 통계 조회 함수
    // ========================================================================

    /**
     * 카테고리별 학습 진도 통계 조회
     *
     * @param {Array} words - 단어 배열
     * @returns {Object} { total, memorized, learning, new, percentage }
     */
    getCategoryProgress(words) {
        const total = words.length;
        if (total === 0) return { total: 0, memorized: 0, learning: 0, new: 0, percentage: 0 };

        const counts = { memorized: 0, learning: 0, new: 0 };
        words.forEach(word => {
            const status = this.getWordStatus(word.id);
            counts[status] = (counts[status] || 0) + 1;
        });

        // 'new'는 나머지 단어 수로 계산 (누락 방지)
        counts.new = total - counts.memorized - counts.learning;

        return {
            total,
            ...counts,
            percentage: Math.round((counts.memorized / total) * 100)
        };
    },

    /**
     * 전체 학습 진도 통계 조회
     * @returns {Object} { total, memorized, learning, new, percentage }
     */
    getOverallProgress() {
        return this.getCategoryProgress(VocabData.allWords);
    },

    /**
     * 학습 세션 기록
     *
     * [동작]
     * 1. 연속 학습일(streak) 계산 및 업데이트
     * 2. 총 학습 단어 수 누적
     * 3. 학습 히스토리에 오늘 기록 추가
     * 4. 최근 30일 히스토리만 유지
     *
     * @param {number} wordsStudied - 이번 세션에서 학습한 단어 수
     */
    recordStudySession(wordsStudied) {
        const today = new Date().toISOString().split('T')[0];

        if (this.stats.lastStudyDate !== today) {
            // 연속 학습일 계산
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (this.stats.lastStudyDate === yesterdayStr) {
                // 어제 학습했으면 streak 증가
                this.stats.streakDays++;
            } else if (this.stats.lastStudyDate !== today) {
                // 연속 끊김 - 1로 리셋
                this.stats.streakDays = 1;
            }

            this.stats.lastStudyDate = today;
        }

        // 총 학습 단어 수 누적
        this.stats.totalStudied += wordsStudied;

        // 히스토리에 오늘 기록 추가
        this.stats.studyHistory.push({
            date: today,
            words: wordsStudied,
            timestamp: Date.now()
        });

        // 최근 30일 히스토리만 유지
        if (this.stats.studyHistory.length > 30) {
            this.stats.studyHistory = this.stats.studyHistory.slice(-30);
        }

        this.saveStats();
    },

    // ========================================================================
    // 데이터 내보내기/가져오기 함수
    // ========================================================================

    /**
     * 전체 데이터 내보내기 (백업)
     *
     * [내보내는 데이터]
     * - progress: 학습 진도
     * - settings: 사용자 설정
     * - stats: 학습 통계
     * - customCategories: 사용자 카테고리
     * - disabledCategories: 비활성화된 카테고리
     *
     * [파일명]
     * vocabmaster_backup_YYYY-MM-DD.json
     *
     * @returns {boolean} 성공 여부
     */
    exportData() {
        const data = {
            type: 'vocabmaster_backup',
            version: Version.CURRENT,
            exportDate: new Date().toISOString(),
            progress: this.progress,
            settings: this.settings,
            stats: this.stats,
            customCategories: this.customCategories,
            disabledCategories: this.disabledCategories
        };

        // JSON 파일 생성 및 다운로드
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vocabmaster_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // 백업 날짜 기록 (알림 주기 계산용)
        this.recordBackup();

        return true;
    },

    /**
     * 백업 데이터 가져오기 (복원)
     *
     * [머지 모드 (기본값)]
     * - progress: 높은 상태 유지 (memorized > learning > new)
     * - customCategories: 새 카테고리 추가, 기존 카테고리에 새 단어 추가
     * - stats: 높은 값 유지
     * - disabledCategories: 병합
     *
     * [교체 모드]
     * - 기존 데이터를 완전히 덮어씀
     *
     * [중요]
     * - import 성공 시 _loadStatus를 'loaded'로 설정
     * - 이로써 corrupted 상태를 해제하고 정상 저장 가능
     *
     * @param {string} jsonData - 백업 JSON 문자열
     * @param {boolean} mergeMode - 머지 모드 (true: 머지, false: 교체)
     * @returns {Object|boolean} { success, merged } 또는 false
     */
    importData(jsonData, mergeMode = true) {
        try {
            let data = JSON.parse(jsonData);
            const statusPriority = { 'new': 0, 'learning': 1, 'memorized': 2 };

            // 버전 확인 및 마이그레이션
            const importVersion = data.version || '0.0.0';
            if (!Version.isCompatible(importVersion)) {
                console.warn('경고: Import 버전이 현재 앱 버전보다 높음');
            }

            // 구버전 데이터 마이그레이션
            if (Version.compare(Version.normalize(importVersion), Version.CURRENT) < 0) {
                data = Version.migrate(data, importVersion);
                console.log('데이터 마이그레이션 완료:', importVersion, '→', Version.CURRENT);
            }

            // Progress 가져오기
            if (data.progress) {
                if (mergeMode) {
                    // 머지: 높은 상태 유지
                    Object.entries(data.progress).forEach(([wordId, importedStatus]) => {
                        const currentStatus = this.progress[wordId] || 'new';
                        const currentPriority = statusPriority[currentStatus] || 0;
                        const importedPriority = statusPriority[importedStatus] || 0;

                        // 더 높은 상태로 업데이트
                        if (importedPriority > currentPriority) {
                            this.progress[wordId] = importedStatus;
                        }
                    });
                } else {
                    // 교체 모드
                    this.progress = data.progress;
                }
                // import 성공 시 corrupted 상태 해제
                this._loadStatus.progress = 'loaded';
                this.saveProgress();
            }

            // Settings 가져오기
            if (data.settings) {
                this.settings = { ...this.settings, ...data.settings };
                this._loadStatus.settings = 'loaded';
                this.saveSettings();
                this.applySettings();
            }

            // Stats 가져오기
            if (data.stats) {
                // 머지: 높은 값 유지
                this.stats.totalStudied = Math.max(this.stats.totalStudied || 0, data.stats.totalStudied || 0);
                this.stats.streakDays = Math.max(this.stats.streakDays || 0, data.stats.streakDays || 0);

                // memorized 개수는 merged progress에서 재계산
                this.stats.totalMemorized = Object.values(this.progress).filter(s => s === 'memorized').length;

                // 학습 히스토리 머지 (날짜별 중복 제거, 높은 값 유지)
                if (data.stats.studyHistory) {
                    const historyMap = new Map();
                    [...(this.stats.studyHistory || []), ...data.stats.studyHistory].forEach(entry => {
                        const key = entry.date;
                        if (!historyMap.has(key) || historyMap.get(key).words < entry.words) {
                            historyMap.set(key, entry);
                        }
                    });
                    this.stats.studyHistory = Array.from(historyMap.values())
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .slice(-30);
                }

                this._loadStatus.stats = 'loaded';
                this.saveStats();
            }

            // Custom Categories 가져오기
            if (data.customCategories && Array.isArray(data.customCategories)) {
                if (mergeMode) {
                    // 머지: 새 카테고리 추가, 기존 카테고리에 새 단어 추가
                    data.customCategories.forEach(importedCat => {
                        const existingCat = this.customCategories.find(c => c.id === importedCat.id);
                        if (existingCat) {
                            // 기존 카테고리에 새 단어만 추가
                            importedCat.words.forEach(word => {
                                if (!existingCat.words.find(w => w.id === word.id)) {
                                    existingCat.words.push(word);
                                }
                            });
                        } else {
                            // 새 카테고리 추가
                            this.customCategories.push(importedCat);
                        }
                    });
                } else {
                    // 교체 모드
                    this.customCategories = data.customCategories;
                }
                this._loadStatus.customCategories = 'loaded';
                this.saveCustomCategories();
            }

            // Disabled Categories 가져오기
            if (data.disabledCategories && Array.isArray(data.disabledCategories)) {
                if (mergeMode) {
                    // 머지: 중복 제외하고 추가
                    data.disabledCategories.forEach(catId => {
                        if (!this.disabledCategories.includes(catId)) {
                            this.disabledCategories.push(catId);
                        }
                    });
                } else {
                    // 교체 모드
                    this.disabledCategories = data.disabledCategories;
                }
                this._loadStatus.disabledCategories = 'loaded';
                this.saveDisabledCategories();
            }

            return { success: true, merged: mergeMode };
        } catch (e) {
            console.error('Import 에러:', e);
            return false;
        }
    },

    // ========================================================================
    // 데이터 초기화 함수
    // ========================================================================

    /**
     * 전체 학습 데이터 초기화
     *
     * [초기화 대상]
     * - progress: 학습 진도
     * - stats: 학습 통계
     *
     * [초기화하지 않는 것]
     * - settings: 사용자 설정
     * - customCategories: 사용자 카테고리
     * - disabledCategories: 비활성화된 카테고리
     */
    resetAll() {
        this.progress = {};
        this.stats = {
            totalStudied: 0,
            totalMemorized: 0,
            streakDays: 0,
            lastStudyDate: null,
            studyHistory: []
        };

        localStorage.removeItem(this.KEYS.PROGRESS);
        localStorage.removeItem(this.KEYS.STATS);
    }
};

// ============================================================================
// Storage.init()은 data.js에서 호출됨
// 올바른 초기화 순서를 보장하기 위해 여기서 직접 호출하지 않음
// ============================================================================
