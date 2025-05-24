"use client";

import { userRole } from "@/app/lib/globalFunctions";
import { cn } from "@/app/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/custom/dialog";
import { AnimatedList } from "@/components/ui/magicui/animated-list";
import {
  AtSignIcon,
  CopyIcon,
  CreditCardIcon,
  HandHeartIcon,
  PhoneIcon,
  QrCodeIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

// Constants
const DONATION_INFO = {
  account: "0304014413780017",
  qr: "00020101021127290108929791970213YAS94SER@BMCT5926YASSERKHAMISABDULLAHALSAID6304d260",
  phone: "92979197",
  username: "YAS94SER@BMCT",
} as const;

const MOTIVATION_ID = "motivation";

type DonationMethod = "account" | "qr" | "phone" | "username";

const DONATION_METHODS = [
  { method: "account" as const, icon: CreditCardIcon, label: "رقم الحساب" },
  { method: "qr" as const, icon: QrCodeIcon, label: "رمز QR" },
  { method: "phone" as const, icon: PhoneIcon, label: "رقم الهاتف" },
  { method: "username" as const, icon: AtSignIcon, label: "اسم المستخدم" },
];

export default function DonationNotification({
  className,
  currentUser,
}: {
  className?: string;
  currentUser: any;
}) {
  const { isADMIN, isCOMPANY, isStaffUser } = userRole(currentUser);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donationMethod, setDonationMethod] =
    useState<DonationMethod>("account");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("تم النسخ بنجاح", {
      description: "تم نسخ المعلومات إلى الحافظة",
    });
  };

  if (!isADMIN && !isCOMPANY) {
    return null;
  }

  if (isStaffUser && !isADMIN) {
    return null;
  }

  const DonationNotificationList = ({
    id,
    name,
    icon,
    badge,
  }: {
    id: string;
    name: string;
    icon: string;
    badge?: string;
    show: boolean;
  }) => {
    return (
      <motion.figure
        className={cn(
          "relative mx-auto min-h-fit w-full cursor-pointer overflow-hidden rounded-full px-3 py-2",
          "transition-all duration-200 ease-in-out hover:scale-[102%]",
          "bg-white/80 backdrop-blur-md [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
          "transform-gpu dark:bg-gray-900/30 dark:backdrop-blur-md dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]"
        )}
        onClick={() => setIsDialogOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeInOut",
              }}
              style={{
                left: `${20 + i * 30}%`,
                top: `${50 + i * 10}%`,
              }}
            />
          ))}
        </div>
        <div className="flex flex-row items-center gap-2">
          <div
            className={cn("flex size-8 items-center justify-center rounded-lg")}
          >
            <span
              className={cn(
                id === MOTIVATION_ID
                  ? "motion-preset-shake text-2xl"
                  : "text-base"
              )}
            >
              {icon}
            </span>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            {badge && (
              <span className="bg-accent w-fit rounded-full px-1.5 py-0.5 text-[10px]">
                {badge}
              </span>
            )}
            <div className="flex flex-row items-center justify-between">
              <figcaption className="text-foreground flex flex-row items-center text-[13px] font-medium">
                <span
                  className={cn(
                    id !== MOTIVATION_ID ? "motion-preset-focus truncate" : ""
                  )}
                >
                  {name}
                </span>
              </figcaption>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-end mt-1">
          <div
            className={cn(
              "bg-primary102/90 flex items-center justify-center gap-1 rounded-full px-4 py-2 font-bold text-white shadow-lg backdrop-blur-xs transition-all"
            )}
          >
            <span className="text-[12px] whitespace-nowrap">
              <p className="hidden md:block">ادعم المنصة</p>
              <p className="tracking-tight md:hidden">ادعمنا</p>
            </span>
            <HandHeartIcon size={20} className="shrink-0" />
          </div>
        </div>
      </motion.figure>
    );
  };

  const DonationMethodSelector = () => (
    <div className="grid grid-cols-2 gap-4 py-4">
      {DONATION_METHODS.map(({ method, icon: Icon, label }) => (
        <motion.div
          key={method}
          className={`cursor-pointer rounded-lg p-4 text-center shadow-md transition-colors backdrop-blur-sm ${
            donationMethod === method
              ? "bg-primary102/90 text-white backdrop-blur-md"
              : "text-primary102 bg-white/80 backdrop-blur-md dark:bg-gray-800/50"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDonationMethod(method)}
        >
          <Icon className="mx-auto mb-2 h-8 w-8" />
          <p className="text-sm font-medium">{label}</p>
        </motion.div>
      ))}
    </div>
  );

  const DonationContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={donationMethod}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center space-y-2"
        >
          <p className="text-muted-foreground text-center text-[15px] font-semibold">
            للتحويل لحساب المطور في بنك مسقط
          </p>
          {donationMethod === "qr" ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="rounded-lg bg-white p-4 shadow-lg">
                <QRCode
                  className="motion-preset-focus"
                  fgColor="#8a86b7"
                  value={DONATION_INFO.qr}
                  size={130}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <motion.p
                className="motion-preset-focus text-primary102 cursor-pointer text-[19px] font-semibold transition-colors hover:text-primary102/80"
                onClick={() => copyToClipboard(DONATION_INFO[donationMethod])}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {DONATION_INFO[donationMethod]}
              </motion.p>
              <motion.button
                onClick={() => copyToClipboard(DONATION_INFO[donationMethod])}
                className="flex items-center gap-2 rounded-lg bg-primary102 px-4 py-2 text-white shadow-md transition-colors hover:bg-primary102/90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CopyIcon size={16} />
                <span className="text-sm">نسخ</span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      <div
        className={cn(
          "fixed left-5 z-50 w-[230px] md:left-8 md:w-[250px]",
          "bottom-35 md:bottom-[120px]",
          className
        )}
      >
        <div className="relative h-full w-full">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatedList
                delay={4000}
                className="space-y-1 transition-all duration-500 ease-in-out"
              >
                <DonationNotificationList
                  id={MOTIVATION_ID}
                  name="كن ضمن الداعمين لهذا الشهر!"
                  icon="👏🏻"
                  badge="ساعدنا في تشغيل وتطوير المنصة"
                  show={true}
                />
              </AnimatedList>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className={cn(
            "sm:max-w-[425px] bg-white/90 backdrop-blur-md dark:bg-gray-900/90 dark:backdrop-blur-md"
          )}
        >
          <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 1.5,
                  ease: "easeInOut",
                }}
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${50 + i * 10}%`,
                }}
              />
            ))}
          </div>
          <DialogHeader>
            <DialogTitle className="text-primary text-center text-2xl font-bold">
              ادعم المنصة
            </DialogTitle>
            <DialogDescription className="text-center">
              مساهمتك تساعدنا في تشغيل وتطوير المنصة لخدمتكم بشكل أفضل
            </DialogDescription>
          </DialogHeader>
          <DonationMethodSelector />
          <div className="flex flex-col items-center justify-center py-4">
            <DonationContent />
          </div>
          <DialogFooter>
            <p className="motion-preset-flomoji-🤝🏻 text-muted-foreground w-full text-center text-sm">
              بانتظار دعمكم 🤝🏻
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

