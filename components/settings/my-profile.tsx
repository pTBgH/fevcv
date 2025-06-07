"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/context"

export function MyProfile() {
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=400&width=400")
  const { t } = useLanguage()

  return (
    <Card>
      <CardContent className="p-6 space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">{t("settings.basicInformation")}</h2>
          <p className="text-sm text-gray-500">{t("settings.personalInformation")}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">{t("settings.profilePhoto")}</h3>
            <p className="text-sm text-gray-500 mb-4">{t("settings.profilePhotoHelp")}</p>
            <div className="flex gap-8 items-start">
              <Image
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full"
              />
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center">
                <p className="text-sm text-blue-600 mb-1">{t("settings.clickToReplace")}</p>
                <p className="text-xs text-gray-500">{t("settings.orDragAndDrop")}</p>
                <p className="text-xs text-gray-500">{t("settings.imageRequirements")}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t("resume.personalDetails")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t("resume.fullName")}</Label>
                <Input id="fullName" placeholder="Jake Gyll" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("resume.phoneNumber")}</Label>
                <Input id="phone" placeholder="+44 1245 572 135" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("resume.email")}</Label>
                <Input id="email" type="email" placeholder="jakegyll@gmail.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">{t("resume.dateOfBirth")}</Label>
                <Input id="dob" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">{t("resume.gender")}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t("resume.gender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("resume.male")}</SelectItem>
                    <SelectItem value="female">{t("resume.female")}</SelectItem>
                    <SelectItem value="other">{t("resume.other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>{t("settings.saveProfile")}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
