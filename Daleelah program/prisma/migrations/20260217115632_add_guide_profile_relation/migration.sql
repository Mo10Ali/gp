-- AddForeignKey
ALTER TABLE `guide_profiles` ADD CONSTRAINT `guide_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
