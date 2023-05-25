"use client";
import Image from "next/image";
import styles from "./page.module.css";
import textStyles from "./text.module.css";
import {
  PayEasyButton,
  PayEasyNoFillIconButton,
  PayEasyOutlineButton,
} from "@/components/payeasy_button/payeasy_button";
import { PayEasyInput } from "@/components/payeasy_input/payeasy_input";
import { SuccessOverlay } from "./success-overlay";
import { Modal } from "@/components/modal/modal";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import {
  UIEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Util } from "@/util";
import { AxiosError } from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ThreeDotLoader } from "@/components/three-dot-loader/three-dot-loader";
import moment from "moment";
import debounce from "lodash.debounce";
import { io } from "socket.io-client";

type AuthData = {
  token: string;
  terminalId: string;
} | null;

type Statistics = {
  totalTransactionAmount: number;
  totalTransactions: number;
  terminalId: string;
} | null;

type Transaction = {
  id: string;
  amount: number;
  reference: string;
  status: string;
  meta: {
    sender: {
      name: string;
      institution: string;
      id: string;
    };
  };
  createdAt: string;
};

type PaginationMeta = {
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
} | null;

const SearchForm = (props: {
  loading: boolean;
  onSubmit(ref: string): unknown;
}) => {
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        props.onSubmit((ev.target as any)["search"].value);
      }}
      className={styles.searchInputContainer}
    >
      <PayEasyInput
        name="search"
        className={styles.searchInput}
        placeholder="Search by reference"
      />

      <PayEasyButton
        disabled={props.loading}
        loading={props.loading}
        className={styles.searchButton}
      >
        <Image
          src="/svg_icons/search.svg"
          alt="Search Icon"
          width={18}
          height={18}
          priority
        />
      </PayEasyButton>
    </form>
  );
};

const LogoutModal = NiceModal.create((props: { logout(): unknown }) => {
  const modal = useModal();

  return (
    <Modal
      visible={modal.visible}
      onClose={modal.hide}
      afterClose={modal.remove}
      title="Logout"
    >
      <div className={styles.logoutConfirm}>
        <p className={textStyles.titleMedium}>
          Are you sure you want to logout?
        </p>

        <div>
          <PayEasyButton
            onClick={props.logout}
            className={styles.confirmButton}
          >
            Yes
          </PayEasyButton>

          <PayEasyOutlineButton
            onClick={modal.hide}
            className={styles.confirmButton}
          >
            No
          </PayEasyOutlineButton>
        </div>
      </div>
    </Modal>
  );
});

const TransactionDetailsModal = NiceModal.create((transaction: Transaction) => {
  const modal = useModal();

  return (
    <Modal
      visible={modal.visible}
      onClose={modal.hide}
      afterClose={modal.remove}
      title="Transaction Details"
    >
      <div className={styles.tnxDetails}>
        <p className={textStyles.headlineSmall}>
          ₦{Util.formatNumber(transaction.amount)}
        </p>

        <div>
          <div>
            <span className={textStyles.bodyLarge}>Name</span>

            <span className={textStyles.titleMedium}>
              {transaction.meta.sender.name}
            </span>
          </div>

          <div>
            <span className={textStyles.bodyLarge}>Date & Time</span>

            <span className={textStyles.titleMedium}>
              {moment(transaction.createdAt).format("DD/MM/YYYY")}
            </span>
          </div>

          <div>
            <span className={textStyles.bodyLarge}>Reference</span>

            <span className={textStyles.titleMedium}>
              {transaction.reference}
            </span>
          </div>

          <div>
            <span className={textStyles.bodyLarge}>Status</span>

            <span className={textStyles.titleMedium}>{transaction.status}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
});

const TransactionNotFoundModal = NiceModal.create(() => {
  const modal = useModal();

  return (
    <Modal
      visible={modal.visible}
      onClose={modal.hide}
      afterClose={modal.remove}
      title="Transaction not found"
    >
      <div className={styles.tnxDetails}>
        <p className={textStyles.titleMedium}>
          The transaction with that reference was not found
        </p>
      </div>
    </Modal>
  );
});

const useStatistics = (authData: AuthData, params: unknown) => {
  const [statistics, setStatistics] = useState<Statistics>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authData) {
      setLoading(true);
      Util.http
        .get("/merchants/payments/statistics")
        .then((res) => {
          const data = res.data.data as Statistics;

          setStatistics(data);
        })
        .catch((error) => {
          Util.handleHttpError(error, ({ message }) => {
            toast.error(`error getting statistics - ${message}`);
          });
        })
        .finally(() => setLoading(false));
    }
  }, [authData, params]);

  return { loadingStatistics: loading || !statistics, statistics };
};

const useBarCode = (authData: AuthData) => {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authData) {
      setLoading(true);
      Util.http
        .get("/payments/barcodes")
        .then((res) => {
          const code = res.data.data as string;

          setBarcode(code);
        })
        .catch((error) => {
          Util.handleHttpError(error, ({ message }) => {
            toast.error(`error generating barcode -${message}`);
          });
        })
        .finally(() => setLoading(false));
    }
  }, [authData]);

  return { loadingBarcode: loading || !barcode, barcode };
};

const useTransactions = (
  authData: AuthData,
  params: { limit: number; page: number; search?: string }
) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>(null);

  useEffect(() => {
    if (authData) {
      setLoading(true);
      Util.http
        .get("/merchants/payments/transactions", {
          params: { page: params.page, limit: params.limit },
        })
        .then((res) => {
          const data = res.data.data as typeof transactions;
          const meta = res.data.meta as typeof pagination;

          setPagination(meta);
          setTransactions((transactions) => {
            for (var i = 0; i < data.length; i += 1) {
              const index = (meta?.pagingCounter ?? 0) + i - 1;
              if (
                transactions[index] &&
                data[index].id !== transactions[index].id
              ) {
                transactions.splice(index, 0, data[index]);
                continue;
              }

              transactions[index] = data[i];
            }

            return transactions;
          });
        })
        .catch((error) => {
          Util.handleHttpError(error, ({ message }) => {
            toast.error(`error getting transactions - ${message}`);
          });
        })
        .finally(() => setLoading(false));
    }
  }, [authData, params]);

  return {
    loadingTransactions: loading || !pagination,
    transactions,
    pagination,
  };
};

export default function Home() {
  const router = useRouter();
  const [authData, setAuthData] = useState<AuthData>(null);
  const [loading, setLoading] = useState(false);
  const [successOverlay, setSuccessOverlay] = useState({
    name: "",
    amount: "",
  });
  const { barcode, loadingBarcode } = useBarCode(authData);
  const [params, setParams] = useState({ page: 1, limit: 100, unique: "" });
  const { statistics, loadingStatistics } = useStatistics(authData, params);
  const { loadingTransactions, transactions, pagination } = useTransactions(
    authData,
    params
  );
  const { page, nextPage } = pagination || {};

  const logout = useCallback(() => {
    localStorage.clear();
    router.replace("/login");
  }, [router]);

  const getTransaction = useCallback(
    async (reference: string) => {
      if (reference && authData) {
        try {
          setLoading(true);
          const { data } = await Util.http.get(`/payments/${reference}`);

          NiceModal.show(TransactionDetailsModal, data.data);
        } catch (error) {
          NiceModal.show(TransactionNotFoundModal);
        } finally {
          setLoading(false);
        }
      }
    },
    [authData]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll: UIEventHandler<HTMLDivElement> = useCallback(
    debounce((event) => {
      const divElement = event.target;
      if (
        divElement &&
        divElement.scrollTop + divElement.clientHeight >=
          divElement.scrollHeight
      ) {
        setParams((params) => ({
          ...params,
          page: nextPage || page || 1,
        }));
      }
    }, 1000),
    [nextPage, page]
  );

  useEffect(() => {
    if (!localStorage.authData) {
      logout();
      return;
    }
    let data: AuthData;
    try {
      data = JSON.parse(localStorage.authData);
      if (!data?.terminalId || !data?.token) {
        logout();
        return;
      }

      const tokenInterceptor = Util.http.interceptors.request.use((config) => {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${data?.token}`;

        return config;
      });
      const authInterceptor = Util.http.interceptors.response.use(
        (res) => res,
        (error: AxiosError) => {
          if (error.response?.status === 401) {
            logout();
          }

          return Promise.reject(error);
        }
      );

      setAuthData(data);

      return () => {
        Util.http.interceptors.request.eject(tokenInterceptor);
        Util.http.interceptors.response.eject(authInterceptor);
      };
    } catch (error) {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    if (authData) {
      const timeout = setTimeout(() => {
        if ("Notification" in window) {
          Notification.requestPermission().catch(() => {});
        }
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [authData]);

  useEffect(() => {
    if (authData) {
      const authToken = `Bearer ${authData?.token}`;
      const socket = io(Util.env().apiUrl as string, {
        transports: ["websocket"],
        query: { authorization: authToken },
        transportOptions: {
          websocket: {
            headers: {
              authorization: authToken,
            },
            extraHeaders: {
              authorization: authToken,
            },
          },
        },
      });

      const events = [] as any[];

      socket.on("MerchantTransaction", (data) => {
        setParams((params) => ({
          ...params,
          page: 1,
          unique: Math.random().toString(),
        }));

        events.push(data);
      });

      const interval = setInterval(() => {
        const event = events.pop();
        if (event) {
          const name = event.transaction.meta.sender.name;
          const amount = Util.formatNumber(event.transaction.amount);
          setSuccessOverlay({
            name,
            amount,
          });

          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification(`You just received ₦${amount} from ${name}`, {
              icon: "/favicon.ico",
            });
            const song = new Audio("/not.wav");
            song.play();
          }
        }
      }, 3000);

      return () => {
        socket.disconnect();
        clearInterval(interval);
      };
    }
  }, [authData]);

  return (
    <NiceModal.Provider>
      <main className={styles.main}>
        <div className={styles.header}>
          <Image
            src="/payeasy_organge.svg"
            alt="PayEasy Logo"
            width={96}
            height={61}
            priority
          />

          <PayEasyNoFillIconButton
            onClick={() => NiceModal.show(LogoutModal, { logout })}
            className={styles.logoutButton}
          >
            <Image
              src="/svg_icons/logout_filled.svg"
              alt="Logout Icon"
              width={24}
              height={24}
              priority
            />
            Logout
          </PayEasyNoFillIconButton>
        </div>
        <div className={styles.mobileView}>
          <div>
            {loadingBarcode ? (
              <div
                style={{
                  height: "300px",
                  width: "300px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThreeDotLoader />
              </div>
            ) : (
              <Image
                src={barcode}
                alt="Terminal Barcode"
                width={300}
                height={300}
                className={styles.barcode}
                priority
              />
            )}
          </div>

          <SearchForm loading={loading} onSubmit={getTransaction} />

          <div style={{ width: "100%" }}>
            <div className={styles.tableContainer} onScroll={handleScroll}>
              <table>
                <thead>
                  <tr>
                    <th className={textStyles.labelLarge}>Names</th>
                    <th className={textStyles.labelLarge}>Amount</th>
                    <th className={textStyles.labelLarge}>Reference</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => {
                    return (
                      <tr key={transaction.id}>
                        <td className={textStyles.bodySmall}>
                          {transaction.meta.sender.name}
                        </td>
                        <td className={textStyles.bodySmall}>
                          ₦{Util.formatNumber(transaction.amount)}
                        </td>
                        <td className={textStyles.bodySmall}>
                          {transaction.reference}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {loadingTransactions && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 0px 0px",
                }}
              >
                <ThreeDotLoader />
              </div>
            )}
          </div>

          <SuccessOverlay {...successOverlay} />
        </div>
        <div className={styles.desktopView}>
          <div className={styles.cards}>
            <div className={styles.card} data-card-bg1>
              <div className={styles.cardContent}>
                <div>
                  <p className={textStyles.payeasyBody}>Transactions(Amount)</p>

                  <Image
                    src="/svg_icons/cash.svg"
                    alt="Cash Icon"
                    width={48}
                    height={48}
                    priority
                  />
                </div>

                {loadingStatistics ? (
                  <Skeleton width={166} height={30} />
                ) : (
                  <p className={textStyles.payeasyTitleMedium}>
                    ₦ {Util.formatNumber(statistics?.totalTransactionAmount)}
                  </p>
                )}
              </div>
            </div>
            <div className={styles.card} data-card-bg2>
              <div className={styles.cardContent}>
                <div>
                  <p className={textStyles.payeasyBody}>Transactions(Count)</p>

                  <Image
                    src="/svg_icons/trend.svg"
                    alt="Trend Icon"
                    width={48}
                    height={48}
                    priority
                  />
                </div>

                {loadingStatistics ? (
                  <Skeleton width={166} height={30} />
                ) : (
                  <p className={textStyles.payeasyTitleMedium}>
                    {Util.formatNumber(statistics?.totalTransactions)}
                  </p>
                )}
              </div>
            </div>
            <div className={styles.card} data-card-bg3>
              <div className={styles.cardContent}>
                <div>
                  <p className={textStyles.payeasyBody}>Terminal ID</p>

                  <Image
                    src="/svg_icons/terminal.svg"
                    alt="Terminal Icon"
                    width={48}
                    height={48}
                    priority
                  />
                </div>

                {loadingStatistics ? (
                  <Skeleton width={166} height={30} />
                ) : (
                  <p className={textStyles.payeasyTitleMedium}>
                    {statistics?.terminalId}
                  </p>
                )}
              </div>
            </div>
            <div
              className={`${styles.card} ${styles.barcodeCard}`}
              data-card-bg4
            >
              <div className={styles.barcodeCardContent}>
                <div>
                  <p className={textStyles.titleMedium}>Scan to pay!</p>

                  <p className={textStyles.bodySmall}>
                    Share this barcode with customers to get transactions on
                    this terminal.
                  </p>
                </div>

                <div>
                  {loadingBarcode ? (
                    <div
                      style={{
                        height: "73px",
                        width: "77px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ThreeDotLoader />
                    </div>
                  ) : (
                    <Image
                      src={barcode}
                      alt="Terminal Barcode"
                      width={77}
                      height={73}
                      className={styles.barcode}
                      priority
                    />
                  )}

                  <PayEasyNoFillIconButton
                    disabled={loadingBarcode}
                    onClick={() => window.print()}
                  >
                    <Image
                      src="/svg_icons/print.svg"
                      alt="Print Icon"
                      width={18}
                      height={18}
                      priority
                    />
                    <span className={textStyles.titleSmall}>Print</span>
                  </PayEasyNoFillIconButton>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.titleBar}>
            <p className={textStyles.headlineSmall}>Transactions</p>

            <div>
              <SearchForm loading={loading} onSubmit={getTransaction} />
            </div>
          </div>

          <div style={{ width: "100%" }}>
            <div className={styles.tableContainer} onScroll={handleScroll}>
              <table>
                <thead>
                  <tr>
                    <th className={textStyles.labelLarge}>Names</th>
                    <th className={textStyles.labelLarge}>Date</th>
                    <th className={textStyles.labelLarge}>Amount</th>
                    <th className={textStyles.labelLarge}>Reference</th>
                    <th className={textStyles.labelLarge}>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => {
                    return (
                      <tr key={transaction.id}>
                        <td className={textStyles.bodySmall}>
                          {transaction.meta.sender.name}
                        </td>
                        <td className={textStyles.bodySmall}>
                          {moment(transaction.createdAt).format(
                            "MMMM, DD YYYY, hh:mma"
                          )}
                        </td>
                        <td className={textStyles.bodySmall}>
                          ₦{Util.formatNumber(transaction.amount)}
                        </td>
                        <td className={textStyles.bodySmall}>
                          {transaction.reference}
                        </td>
                        <td className={textStyles.bodySmall}>
                          {transaction.status}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {loadingTransactions && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "50px 0px 0px",
                }}
              >
                <ThreeDotLoader />
              </div>
            )}
          </div>
        </div>
        <div className={styles.printView}>
          <div>
            <Image
              src={barcode}
              alt="Barcode"
              width={250}
              height={250}
              priority
            />
          </div>
        </div>
      </main>
      <ToastContainer
        hideProgressBar
        autoClose={3000}
        position="bottom-center"
      />
    </NiceModal.Provider>
  );
}
